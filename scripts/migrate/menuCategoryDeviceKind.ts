import pg from 'pg';
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

  const getRandomItem = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  const deviceKindsResult = await dbClient.query(
    'SELECT id, total_quantity FROM device_kinds',
  );
  const deviceKinds = deviceKindsResult.rows;

  const labsResult = await dbClient.query('SELECT id FROM labs');
  const labIds = labsResult.rows.map((row) => row.id);

  const rolesResult = await dbClient.query('SELECT id FROM role');
  const roleIds = rolesResult.rows.map((row) => row.id);

  const usersResult = await dbClient.query('SELECT id FROM "user"');
  const userIds = usersResult.rows.map((row) => row.id);

  const deviceQualities = ['healthy', 'needs_fixing', 'broken', 'lost'];
  const deviceStatuses = [
    'available',
    'borrowing',
    'shipping',
    'assessing',
    'maintaining',
    'discarded',
  ];

  for (const deviceKind of deviceKinds) {
    for (let i = 0; i < deviceKind.total_quantity; i++) {
      const insertQuery = `
          INSERT INTO devices (
            kind,
            quantity,
            lab_id,
            available_quantity,
            quality,
            allowed_borrow_role,
            meta,
            borrower_id,
            status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

      const values = [
        deviceKind.id,
        1,
        getRandomItem(labIds),
        1,
        getRandomItem(deviceQualities),
        getRandomItem(roleIds),
        '{}',
        Math.random() < 0.2 ? getRandomItem(userIds) : null,
        getRandomItem(deviceStatuses),
      ];

      await dbClient.query(insertQuery, values);
    }
  }

  await dbClient.end();
}

insertMockDevicesData();
