import pg from 'pg';
import { config as configEnv } from 'dotenv';

configEnv();

async function insertAvailableQuantityIntoDeviceKind() {
  const { Client } = pg;
  const dbClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  await dbClient.connect();

  const labs = await dbClient.query<{ name: string }>('SELECT name from labs');

  const deviceKindsQuery = await dbClient.query<{
    id: number;
    total_quantity: number;
  }>('SELECT id, total_quantity FROM device_kinds');

  await Promise.all(
    deviceKindsQuery.rows.map(async (deviceKind) => {
      const distribution = await distributeProductsToLabs(
        labs.rows,
        deviceKind.total_quantity || 0,
      );
      const availableQuantityJson = JSON.stringify(distribution);
      return dbClient.query(
        'UPDATE device_kinds SET available_quantity = $1 WHERE id = $2',
        [availableQuantityJson, deviceKind.id],
      );
    }),
  );

  await dbClient.end();
}
async function distributeProductsToLabs(
  labs: { name: string }[],
  totalProducts: number,
): Promise<{ [lab: string]: number }> {
  const availableQuantity: { [lab: string]: number } = {};
  let remainingProducts = totalProducts;

  labs.slice(0, labs.length - 1).forEach((row) => {
    const randomQuantity = Math.floor(Math.random() * remainingProducts);

    if (randomQuantity > 0) {
      availableQuantity[row.name] = randomQuantity;
      remainingProducts -= randomQuantity;
    }
  });

  if (remainingProducts > 0) {
    availableQuantity[labs[labs.length - 1].name] = remainingProducts;
  }

  return availableQuantity;
}
insertAvailableQuantityIntoDeviceKind();
