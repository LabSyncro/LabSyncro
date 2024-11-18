import pg from 'pg';
import fs from 'fs';
import { from as copyFrom } from 'pg-copy-streams';
import { config as configEnv } from 'dotenv';
configEnv();

interface LabQuantity {
  [labId: string]: number;
}

async function insertMockDevicesData () {
  const { Client } = pg;
  const dbClient = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
  });

  await dbClient.connect();

  const getRandomItem = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const deviceKindsResult = await dbClient.query(
    'SELECT id, total_quantity, available_quantity FROM device_kinds ORDER BY id',
  );
  const deviceKinds = deviceKindsResult.rows;

  const deviceStatuses = [
    'available',
    'borrowing',
    'shipping',
    'assessing',
    'maintaining',
    'discarded',
  ];

  const tempFilePath = 'temp_devices_data_test.csv';
  const fileStream = fs.createWriteStream(tempFilePath);

  for (const deviceKind of deviceKinds) {
    const labQuantities = deviceKind.available_quantity as LabQuantity;

    if (!labQuantities || Object.keys(labQuantities).length === 0) {
      console.warn(`No lab quantities found for device kind ${deviceKind.id}`);
      continue;
    }

    // Generate devices for each lab based on its quantity
    for (const [labId, quantity] of Object.entries(labQuantities)) {
      for (let i = 0; i < quantity; i++) {
        const row = `${deviceKind.id},${labId},{},${getRandomItem(deviceStatuses)}\n`;
        fileStream.write(row);
      }
    }
  }

  fileStream.end();

  await new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });

  try {
    await dbClient.query('BEGIN');
    const copyStream = dbClient.query(
      copyFrom(
        'COPY devices (kind, lab_id, meta, status) FROM STDIN WITH (FORMAT csv, NULL \'\\N\')',
      ),
    );

    const readStream = fs.createReadStream(tempFilePath);
    readStream.pipe(copyStream);

    await new Promise((resolve, reject) => {
      copyStream.on('finish', resolve);
      copyStream.on('error', reject);
    });

    await dbClient.query('COMMIT');
    console.log('Data generation completed successfully');
  } catch (error) {
    await dbClient.query('ROLLBACK');
    console.error('Error generating data:', error);
    throw error;
  } finally {
    await dbClient.end();
    fs.unlink(tempFilePath, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });
  }
}

insertMockDevicesData().catch((error) =>
  console.error('Processing failed:', error),
);
