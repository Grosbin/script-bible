import { getBooks } from "./helpers/getBook";

// let genesisUrl = 'https://www.biblegateway.com/passage/?search=G%C3%A9nesis+1&version=NTV';

let Url =
  "https://www.biblegateway.com/passage/?search=1%20Samuel+1&version=NTV";

const nameBook = "1samuel";
const chartBook = "1Sam";
const lengthChapter = 31;

getBooks(Url, nameBook, chartBook, lengthChapter);
