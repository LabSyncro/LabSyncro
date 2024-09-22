import { Builder, until } from 'selenium-webdriver';
import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';

const driver = new Builder()
  .forBrowser('MicrosoftEdge')
  .usingServer('http://localhost:4444/wd/hub')
  .build();
const url = 'https://www.thegioiic.com/product/ic-vi-dieu-khien';
driver
  .get(url)
  .then(() => driver.wait(until.titleContains('IC Vi Điều Khiển'), 10000))
  .then(() => driver.getPageSource())
  .then((source: string) => {
    const $ = cheerio.load(source);
    getProductElements($).map((ele) => {
      console.log(extractProductInfo(ele));
    });
  })
  .then(() => {
    driver.quit();
  });

const getProductElements = ($: cheerio.CheerioAPI) => {
  const productEles: cheerio.Cheerio<AnyNode>[] = [];
  $('.box-item').each((_, ele) => {
    productEles.push($(ele));
  });
  return productEles;
};

const extractProductInfo = ($: cheerio.Cheerio<AnyNode>) => {
  const image = normalizeText(
    $.find('.image img').attr('data-src') ||
      $.find('.image img').attr('src') ||
      '',
  );
  return { image };
};

const normalizeText = (text: string) => {
  return text.replace(/\\n/g, '').trim();
};
