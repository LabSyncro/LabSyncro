import pg from 'pg';
import { config as configEnv } from 'dotenv';

type Category = {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  slug: string;
  number_product?: number;
};

configEnv();

async function fetchAndInsertCategories() {
  const categoryLevel1And2Url = 'https://www.thegioiic.com/v1/get-menu';

  const response = await fetch(categoryLevel1And2Url);
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
      const query1 = {
        text: 'INSERT INTO categories (id, name, parent_id, level) VALUES ($1, $2, $3, $4)',
        values: [rest.id, rest.name, rest.parent_id, rest.level],
      };
      await dbClient.query(query1);

      if (rest.parent_id === 0) {
        return;
      }

      const categoryLevel3Url = `https://www.thegioiic.com/v1/get-category?parent_id=${rest.id}&level=3`;
      const response = await fetch(categoryLevel3Url);
      const categoryLevel3Data: Category[] = (await response.json()).categories;

      await Promise.all(
        categoryLevel3Data.map(async (subItem) => {
          const { id, name, parent_id, number_product } = subItem;
          const availableQuantity = await distributeProductsToLabs(
            dbClient,
            number_product || 0,
          );

          const query2 = {
            text: 'INSERT INTO device_kinds (id, name, category_id, available_quantity) VALUES ($1, $2, $3, $4)',
            values: [id, name, parent_id, availableQuantity],
          };
          await dbClient.query(query2);
        }),
      );
    }),
  );

  await dbClient.end();
}

// Helper function to randomly distribute products across labs
async function distributeProductsToLabs(
  dbClient: pg.Client,
  totalProducts: number,
): Promise<{ [lab: string]: number }> {
  const availableQuantity: { [lab: string]: number } = {};
  let remainingProducts = totalProducts;

  const labs = await dbClient.query<{ name: string }>('SELECT name FROM labs');
  labs.rows.slice(0, labs.rows.length - 1).map((row) => {
    const randomQuantity = Math.floor(Math.random() * remainingProducts);
    availableQuantity[row.name] = randomQuantity;
    remainingProducts -= randomQuantity;
  });

  availableQuantity[labs.rows[labs.rows.length - 1].name] = remainingProducts;

  return availableQuantity;
}

fetchAndInsertCategories();
