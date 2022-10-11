import { chromium } from "playwright";

export const getChapter = async (
  url: string = "",
  numChapter: number = 0,
  chartBook: string = ""
) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
 page.setDefaultNavigationTimeout(0);
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

        return data.join(" ").replace(/—/g, "");
      }
    );

    verses = [...verses, rep];
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
