import { chromium } from "playwright";
import fs from "fs";

export const getChapter = async (
  url: string = "",
  numChapter: number = 0,
  chartBook: string = ""
) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  const chapter = await page.textContent(".dropdown-display-text");

  const dataVer: any = await page.$$eval(".versenum", (verses) =>
    verses.map((verse) => verse.textContent)
  );

  // elimina de page todos los versiculos
  const removeH3 = page.$$eval("h3", (h3) => h3.forEach((h) => h.remove()));
  const removeNumVerse = page.$$eval(".versenum", (verses) =>
    verses.forEach((v) => v.remove())
  );
  const removeChapter = page.$$eval(".chapternum", (verses) =>
    verses.forEach((c) => c.remove())
  );

  await Promise.all([removeH3, removeNumVerse, removeChapter]);

  let numVerse: string[] = [];

  if (!dataVer.includes("1")) {
    numVerse = ["1", ...dataVer];
  }

  let verses: Object[] = [];

  for await (let num of numVerse) {
    const rep: any = await page.$$eval(
      `.${chartBook}-${numChapter}-${num}`,
      (verses) => {
        const data = verses.map((verse) => verse.textContent);
        return data;
      }
    );

    verses = { ...verses, [num.trim()]: rep };
  }

  await browser.close();

  console.log("Libro Obtenido, Capitulo: ", numChapter);
  return {
    [numChapter]: {
      chapter,
      verses,
    },
  };
};

const url =
  "https://www.biblegateway.com/passage/?search=G%C3%A9nesis+1&version=NTV";

const nameBook = "genesis";
const chartBook = "Gen";

const getBooks = async (url: string, nameBook: string, chartBook: string) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  let nowUrl = await page.url();

  for await (let i of Array(50).keys()) {
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

getBooks(url, nameBook, chartBook);
