import pg from 'pg';
import fs from 'fs';
import Cursor from 'pg-cursor';
import { from as copyFrom } from 'pg-copy-streams';
import { config as configEnv } from 'dotenv';

configEnv();

interface Receipt {
  id: string;
  quantity: number;
  expected_returned_at: Date;
  returned_at: Date | null;
  device_kind_id: number;
  lab_id: string;
}

interface Device {
  id: string;
  kind: number;
  lab_id: string;
  is_borrowed: boolean;
}

interface ReceiptDevice {
  receipt_id: string;
  device_id: string;
  status: string | null;
}

const RECEIPT_BATCH_SIZE = 5000;
const TEMP_FILE_PATH = 'temp_receipt_device_data.csv';

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  max: 20,
});

async function getAvailableDevicesInBatch(
  deviceKindId: number,
  labId: string,
  totalNeeded: number,
): Promise<Device[]> {
  const query = `
    WITH selected_devices AS (
      SELECT id, kind, lab_id, is_borrowed 
      FROM devices 
      WHERE kind = $1 
      AND lab_id = $2 
      AND is_borrowed = false
      FOR UPDATE SKIP LOCKED
      LIMIT $3
    )
    UPDATE devices d
    SET is_borrowed = true
    FROM selected_devices sd
    WHERE d.id = sd.id
    RETURNING d.id, d.kind, d.lab_id, d.is_borrowed
  `;

  const result = await pool.query(query, [deviceKindId, labId, totalNeeded]);
  return result.rows;
}

function determineStatus(returnedAt: Date | null): string | null {
  if (!returnedAt) return null;

  const statuses = ['broken', 'healthy', 'needs_fixing', 'lost'];
  const weights = [0.1, 0.6, 0.2, 0.1];

  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i];
  }
  return 'healthy';
}

async function writeReceiptDevicesToFile(receiptDevices: ReceiptDevice[]) {
  const fileStream = fs.createWriteStream(TEMP_FILE_PATH);

  for (const rd of receiptDevices) {
    const row = `${rd.receipt_id},${rd.device_id},${rd.status || '\\N'}\n`;
    fileStream.write(row);
  }

  fileStream.end();

  return new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
}

async function processReceipts() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cursor = client.query(
      new Cursor('SELECT * FROM receipts ORDER BY id'),
    );

    let receipts: Receipt[] = [];
    let processedCount = 0;
    const receiptDevices: ReceiptDevice[] = [];

    // Process receipts in batches
    while ((receipts = await cursor.read(RECEIPT_BATCH_SIZE)).length > 0) {
      await Promise.all(
        receipts.map(async (receipt) => {
          if (Number(receipt.quantity) === 0) return;

          const availableDevices = await getAvailableDevicesInBatch(
            Number(receipt.device_kind_id),
            receipt.lab_id,
            Number(receipt.quantity),
          );

          if (availableDevices.length < receipt.quantity) {
            console.warn(
              `Not enough available devices for receipt ${receipt.id}`,
            );
            return;
          }

          availableDevices.forEach((device) => {
            receiptDevices.push({
              receipt_id: receipt.id,
              device_id: device.id,
              status: determineStatus(receipt.returned_at),
            });
          });
        }),
      );

      processedCount += receipts.length;
      console.log(`Processed ${processedCount} receipts`);
    }

    await cursor.close();

    // Write data to temp file
    await writeReceiptDevicesToFile(receiptDevices);

    // Copy from temp file to database
    const copyStream = client.query(
      copyFrom(
        'COPY receipt_device (receipt_id, device_id, status) FROM STDIN WITH (FORMAT csv, NULL \'\\N\')',
      ),
    );

    const readStream = fs.createReadStream(TEMP_FILE_PATH);
    readStream.pipe(copyStream);

    await new Promise((resolve, reject) => {
      copyStream.on('finish', resolve);
      copyStream.on('error', reject);
    });

    await client.query('COMMIT');
    console.log('Data generation completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error generating data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
    fs.unlink(TEMP_FILE_PATH, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });
  }
}

processReceipts().catch((error) => console.error('Processing failed:', error));
