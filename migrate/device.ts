import pg from 'pg';
import fs from 'fs';
import { from as copyFrom } from 'pg-copy-streams';
import { config as configEnv } from 'dotenv';

configEnv();

async function insertMockDevicesData() {
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
    'SELECT id, total_quantity FROM device_kinds ORDER BY id',
  );
  const deviceKinds = deviceKindsResult.rows;

  const labsResult = await dbClient.query('SELECT id FROM labs');
  const labIds = labsResult.rows.map((row) => row.id);

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
    for (let i = 0; i < deviceKind.total_quantity; i++) {
      const row = `${deviceKind.id},${getRandomItem(labIds)},{},${getRandomItem(deviceStatuses)}\n`;
      fileStream.write(row);
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
        'COPY devices_test (kind, lab_id, meta, status) FROM STDIN WITH (FORMAT csv, NULL \'\\N\')',
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
