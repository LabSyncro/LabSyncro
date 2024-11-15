import pg from 'pg';
import { config as configEnv } from 'dotenv';

configEnv();

async function insertAvailableQuantityIntoDeviceKind() {
  const { Client } = pg;
  const dbClient = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASEB_PORT || '5432'),
  });

  await dbClient.connect();

  const deviceKindsQuery = await dbClient.query<{
    id: number;
  }>('SELECT id FROM device_kinds');

  await Promise.all(
    deviceKindsQuery.rows.map(async (deviceKind) => {
      const quantityQuery = await dbClient.query<{
        lab_name: string;
        available_quantity: number;
        total_quantity: number;
      }>(
        `WITH
          lab_quantities AS (
          SELECT
          labs.name as lab_name,
          SUM(devices.available_quantity)::integer as available_quantity,
          SUM(devices.quantity)::integer as quantity
        FROM
          devices
          JOIN labs ON devices.lab_id = labs.id
        WHERE
          devices.kind = $1
        GROUP BY
          labs.name
        )
        SELECT
          lab_name,
          available_quantity,
          SUM(quantity) OVER () as total_quantity
          FROM
          lab_quantities
        `,
        [deviceKind.id],
      );

      const availableQuantity = quantityQuery.rows.reduce(
        (acc, row) => {
          acc[row.lab_name] = row.available_quantity;
          return acc;
        },
        {} as { [labName: string]: number },
      );

      const totalQuantity = quantityQuery.rows[0]?.total_quantity || 0;
      const availableQuantityJson = JSON.stringify(availableQuantity);

      return dbClient.query(
        'UPDATE device_kinds SET available_quantity = $1, total_quantity = $2 WHERE id = $3',
        [availableQuantityJson, totalQuantity, deviceKind.id],
      );
    }),
  );

  await dbClient.end();
}

insertAvailableQuantityIntoDeviceKind();
