import { chromium } from "playwright";
import fs from "fs";
import { getChapter } from "./getChapter";

export const getBooks = async (
  url: string,
  nameBook: string,
  chartBook: string,
  lengthChapter: number
) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
 page.setDefaultNavigationTimeout(0);
  await page.goto(url);

  let nowUrl = await page.url();

  for await (let i of Array(lengthChapter).keys()) {
    const json_books = fs.readFileSync(`./data/ntv/${nameBook}.json`, "utf8");
    let data: Object[] = JSON.parse(json_books);
    let numChapter = i + 1;
    const bookData = await getChapter(nowUrl, numChapter, chartBook);
    fs.writeFileSync(
      `./data/ntv/${nameBook}.json`,
      JSON.stringify({
        ...data,
        ...bookData,
      }),
      "utf-8"
    );
    await page.locator(".next-chapter").click();
    nowUrl = await page.url();
  }
  await browser.close();
  return console.log("Proceso terminado");
};
