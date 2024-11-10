import pg from 'pg';
import Cursor from 'pg-cursor';
import { config as configEnv } from 'dotenv';
import { Readable } from 'stream';
import { from as copyFrom } from 'pg-copy-streams';

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

async function insertWithCopy(
  client: pg.PoolClient,
  receiptDevices: ReceiptDevice[],
) {
  // First create a temporary table
  await client.query(`
    CREATE TEMP TABLE temp_receipt_device (
      receipt_id UUID,
      device_id UUID,
      status device_quality
    ) ON COMMIT DROP
  `);

  // Prepare the data as a CSV string
  const csvData =
    receiptDevices
      .map((rd) => `${rd.receipt_id},${rd.device_id},${rd.status || '\\N'}`)
      .join('\n') + '\n';

  // Create a readable stream from the CSV data
  const stream = new Readable({
    read() {
      this.push(csvData);
      this.push(null);
    },
  });

  // Use COPY command
  const copyStream = client.query(
    copyFrom(
      'COPY temp_receipt_device (receipt_id, device_id, status) FROM STDIN WITH (FORMAT csv, NULL \'\\N\')',
    ),
  );

  return new Promise((resolve, reject) => {
    // Handle errors on both streams
    stream.on('error', (error) => {
      console.error('Error in readable stream:', error);
      reject(error);
    });

    copyStream.on('error', (error) => {
      console.error('Error in copy stream:', error);
      reject(error);
    });

    // Handle successful completion
    copyStream.on('finish', async () => {
      try {
        // Insert from temp table to actual table
        await client.query(`
          INSERT INTO receipt_device (receipt_id, device_id, status)
          SELECT receipt_id, device_id, status FROM temp_receipt_device
        `);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });

    // Pipe with error handling
    stream.pipe(copyStream).on('error', (error) => {
      console.error('Error in pipe:', error);
      reject(error);
    });
  });
}
async function insertWithBatches(
  client: pg.PoolClient,
  receiptDevices: ReceiptDevice[],
) {
  const BATCH_SIZE = 1000;

  for (let i = 0; i < receiptDevices.length; i += BATCH_SIZE) {
    const batch = receiptDevices.slice(i, i + BATCH_SIZE);
    const values = batch
      .map((_rd, idx) => {
        const offset = idx * 3;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
      })
      .join(', ');

    const params = batch.flatMap((rd) => [
      rd.receipt_id,
      rd.device_id,
      rd.status,
    ]);

    const query = `
      INSERT INTO receipt_device (receipt_id, device_id, status)
      VALUES ${values}
    `;

    await client.query(query, params);
    console.log(`Inserted batch of ${batch.length} records`);
  }
}

async function processReceipts() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cursor = client.query(
      new Cursor('SELECT * FROM receipts ORDER BY id LIMIT 1000'),
    );

    let receipts: Receipt[] = [];
    let processedCount = 0;
    const receiptDevices: ReceiptDevice[] = [];

    // Process receipts in batches
    while ((receipts = await cursor.read(RECEIPT_BATCH_SIZE)).length > 0) {
      await Promise.all(
        receipts.map(async (receipt) => {
          if (receipt.quantity === 0) return;

          const availableDevices = await getAvailableDevicesInBatch(
            receipt.device_kind_id,
            receipt.lab_id,
            receipt.quantity,
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

    try {
      console.log('Attempting COPY method...');
      await insertWithCopy(client, receiptDevices);
    } catch (error) {
      console.warn('COPY method failed, falling back to batch INSERT:', error);
      await insertWithBatches(client, receiptDevices);
    }

    await client.query('COMMIT');
    console.log('Data generation completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error generating data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
processReceipts().catch(console.error);
