import fs from "fs";
import { Bible } from "../types/bible";

export const getBook = (
  chapter: number = 1,
  verse?: number,
  book: Bible = "genesis"
) => {
  const json_books = fs.readFileSync(`./data/ntv/${book}.json`, "utf8");
  let data: [] = JSON.parse(json_books);

  const validChapter = valideChapter(data, chapter);

  if (!validChapter) {
    return "Capitulo no encontrado";
  }

  if (verse) {
    const validVerse: Object = data[chapter]["verses"];
    if (!validVerse.hasOwnProperty(verse)) return "Versiculo no encontrado";
  }

  if (chapter && verse) {
    return [data[chapter]["chapter"], data[chapter]["verses"][verse]];
  }

  return [data[chapter]["chapter"], data[chapter]["verses"]];
};

export const valideChapter = (book: Object, chapter: number) => {
  return book.hasOwnProperty(chapter);
};
