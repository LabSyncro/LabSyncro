import pg from 'pg';
import { config as configEnv } from 'dotenv';
import { Builder, until } from 'selenium-webdriver';

import * as cheerio from 'cheerio';

type Category = {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  slug: string;
  number_product?: number;
};

type ProductInfo = {
  name: string;
  brand: string;
  manufacturer: string;
  unit: string;
  available_quantity: number;
  description: string;
  datasheet: string;
  meta: { [key: string]: string | number | boolean | null };
  image: {
    main_image: string;
    sub_images: string[];
  };
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

  const driver = new Builder()
    .forBrowser('MicrosoftEdge')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

  await dbClient.connect();

  await Promise.all(
    data.map(async (item) => {
      const { slug, ...rest } = item;
      const query1 = {
        text: 'INSERT INTO menus (id, name, parent_id, level) VALUES ($1, $2, $3, $4)',
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
          const { id, name, parent_id, number_product, slug } = subItem;
          const filterCategoryUrl = `https://www.thegioiic.com/v1/filter-category?category_id=${id}`;
          const response = await fetch(filterCategoryUrl);
          const metaData = (await response.json()).properties;

          // const availableQuantity = await distributeProductsToLabs(
          //   dbClient,
          //   number_product || 0,
          // );

          const query2 = {
            text: 'INSERT INTO categories (id, name, menu_id, quantity, meta) VALUES ($1, $2, $3, $4, $5)',
            values: [
              id,
              name,
              parent_id,
              number_product,
              JSON.stringify(metaData),
            ],
          };
          await dbClient.query(query2);

          const totalPages = Math.ceil((number_product || 0) / 40);

          await Promise.all(
            Array.from({ length: totalPages }, (_, i) => i + 1).map(
              async (page) => {
                const deviceKindUrl = `https://www.thegioiic.com/product/${slug}?page=${page}`;
                console.log(deviceKindUrl);
                await driver.get(deviceKindUrl);
                await driver.wait(until.titleContains(name), 10000);
                const source = await driver.getPageSource();
                const $ = cheerio.load(source);
                const productLinks = getProductLinks($);

                await Promise.all(
                  productLinks.map(async (link) => {
                    await driver.get(link);
                    const productSource = await driver.getPageSource();
                    const $$ = cheerio.load(productSource);
                    const {
                      name,
                      brand,
                      manufacturer,
                      description,
                      datasheet,
                      unit,
                      meta,
                      available_quantity,
                    } = extractProductInfo($$);
                    const deviceKindQuery = {
                      text: 'INSERT INTO device_kinds (name, category_id, brand, meta, manufacturer, description, datasheet, unit, available_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                      values: [
                        name,
                        id,
                        brand,
                        JSON.stringify(meta),
                        manufacturer,
                        description,
                        datasheet,
                        unit,
                        available_quantity,
                      ],
                    };
                    try {
                      await dbClient.query(deviceKindQuery);
                    } catch (error) {
                      console.error(
                        `Error inserting device kind: ${name}`,
                        error,
                      );
                      // Optionally, you could log this error to a file or external logging service
                    }
                    await driver.navigate().back();
                  }),
                );
              },
            ),
          );
        }),
      );
    }),
  );

  await driver.quit();
  await dbClient.end();
}

// Helper function to randomly distribute products across labs
// async function distributeProductsToLabs(
//   dbClient: pg.Client,
//   totalProducts: number,
// ): Promise<{ [lab: string]: number }> {
//   const availableQuantity: { [lab: string]: number } = {};
//   let remainingProducts = totalProducts;
//
//   const labs = await dbClient.query<{ name: string }>('SELECT name FROM labs');
//   labs.rows.slice(0, labs.rows.length - 1).map((row) => {
//     const randomQuantity = Math.floor(Math.random() * remainingProducts);
//     availableQuantity[row.name] = randomQuantity;
//     remainingProducts -= randomQuantity;
//   });
//
//   availableQuantity[labs.rows[labs.rows.length - 1].name] = remainingProducts;
//
//   return availableQuantity;
// }

const getProductLinks = ($: cheerio.CheerioAPI) => {
  const productLinks: string[] = [];
  $('.box-item .product-name').each((_, ele) => {
    const href = $(ele).attr('href');
    if (href) {
      productLinks.push(href);
    }
  });
  return productLinks;
};

const extractProductInfo = ($: cheerio.CheerioAPI): ProductInfo => {
  const main_image = normalizeText(
    $('#show-img').attr('data-src') || $('#show-img').attr('src') || '',
  );

  const sub_images: string[] = [];
  $('#small-img-roll img').each((_, imgEle) => {
    const subImageSrc = $(imgEle).attr('data-href');
    if (subImageSrc) {
      sub_images.push(normalizeText(subImageSrc));
    }
  });

  const name = normalizeText($('.product-title-show h1').text());
  const brand = normalizeText(
    $(
      '.product-title-info-price-show .text-medium-s a[href*="thuong-hieu"]',
    ).text(),
  );
  const manufacturer = normalizeText(
    $('.text-medium-s:contains("Mã nhà sx")').text().split('Mã nhà sx')[1],
  );
  const description = normalizeText(
    $('.text-medium-s:contains("Mô tả")').text().split('Mô tả')[1],
  );
  const datasheet = normalizeText(
    $('.text-medium-s:contains("Datasheet") a').attr('href') || '',
  );
  const unit = normalizeText(
    $('.table-price-show .header .td-quantity-price .r')
      .text()
      .replace(/\(.*\)/, '')
      .toLowerCase(),
  );
  const meta: Record<string, string> = {};
  $('.body-tab tbody tr').each((_, row) => {
    const attributeName = $(row).find('td.first-td p').text().trim();
    const attributeValue = $(row).find('td:nth-child(2) p').text().trim();

    if (attributeName && attributeValue) {
      meta[attributeName] = attributeValue;
    }
  });

  const quantityElement = $('.product-info-show .line-26 b');
  const available_quantity = quantityElement
    ? parseInt(quantityElement.text().match(/\d+/)?.[0] || '0', 10)
    : 0;

  return {
    name,
    available_quantity,
    brand,
    manufacturer,
    description,
    datasheet,
    unit,
    meta,
    image: {
      main_image,
      sub_images,
    },
  };
};

const normalizeText = (text: string) => {
  return text.replace(/\\n/g, '').trim();
};

fetchAndInsertCategories();
