import { Builder, until } from 'selenium-webdriver';

import * as cheerio from 'cheerio';

const driver = new Builder()
  .forBrowser('MicrosoftEdge')
  .usingServer('http://localhost:4444/wd/hub')
  .build();
const url = 'https://www.thegioiic.com/product/ic-vi-dieu-khien';
driver
  .get(url)
  .then(() => driver.wait(until.titleContains('IC Vi Điều Khiển'), 10000))
  .then(() => driver.getPageSource())
  .then(async (source: string) => {
    const $ = cheerio.load(source);
    const productLinks = getProductLinks($);

    for (const link of productLinks) {
      await driver.get(link);
      const productSource = await driver.getPageSource();
      const $$ = cheerio.load(productSource);
      const productInfo = extractProductInfo($$);
      console.log(productInfo);
      await driver.navigate().back();
    }
  })
  .then(() => {
    driver.quit();
  });

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

const extractProductInfo = ($: cheerio.CheerioAPI) => {
  const mainImage = normalizeText(
    $('#show-img').attr('data-src') || $('#show-img').attr('src') || '',
  );

  const subImages: string[] = [];
  $('#small-img-roll img').each((_, imgEle) => {
    const subImageSrc = $(imgEle).attr('data-href');
    if (subImageSrc) {
      subImages.push(normalizeText(subImageSrc));
    }
  });

  const name = normalizeText($('.product-title-show h1').text());
  const brand = normalizeText(
    $(
      '.product-title-info-price-show .text-medium-s a[href*="thuong-hieu"]',
    ).text(),
  );
  const manufacturerCode = normalizeText(
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
  const attributes: Record<string, string> = {};
  $('.body-tab tbody tr').each((_, row) => {
    const attributeName = $(row).find('td.first-td p').text().trim();
    const attributeValue = $(row).find('td:nth-child(2) p').text().trim();

    if (attributeName && attributeValue) {
      attributes[attributeName] = attributeValue;
    }
  });

  return {
    mainImage,
    subImages,
    name,
    brand,
    manufacturerCode,
    description,
    datasheet,
    unit,
    attributes,
  };
};

const normalizeText = (text: string) => {
  return text.replace(/\\n/g, '').trim();
};
