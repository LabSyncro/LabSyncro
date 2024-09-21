import pg from 'pg';
import { config as configEnv } from 'dotenv';

type Category = {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  slug: string;
};

configEnv();

async function fetchAndInsertCategories() {
  const apiUrl = 'https://www.thegioiic.com/v1/get-menu';

  const response = await fetch(apiUrl);
  const data: Category[] = (await response.json()).categories;

  const { Client } = pg;

  const dbClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  await dbClient.connect();

  await Promise.all(
    data.map(async (item) => {
      const { slug, ...rest } = item;
      const query = {
        text: 'INSERT INTO device_kinds (id, name, parent_id, level) VALUES ($1, $2, $3, $4)',
        values: [rest.id, rest.name, rest.parent_id, rest.level],
      };
      await dbClient.query(query);
    }),
  );

  await dbClient.end();
}

fetchAndInsertCategories();
