const fs = require("fs");
const { parse } = require("csv-parse/sync");

const bestsellerData = fs.readFileSync(
  "./data/bestsellers with categories.csv",
  "utf8"
);

const books = parse(bestsellerData, {
  columns: true,
  skip_empty_lines: true
});

console.log("Antal rader:", books.length);

const uniqueTitles = new Set(
  books.map(book => book.Name)
);

console.log("Antal unika böcker:", uniqueTitles.size);
const bestbooksData = fs.readFileSync(
  "./data/bestbooks.csv",
  "utf8"
);

const allBooks = parse(bestbooksData, {
  columns: true,
  skip_empty_lines: true
});

console.log("Antal böcker i bestbooks:", allBooks.length);
const bestbookTitles = new Set(
  allBooks.map(book => book.book_title)
);

const matchedTitles = [...uniqueTitles].filter(title =>
  bestbookTitles.has(title)
);

console.log("Exakta matchningar:", matchedTitles.length);
console.log("Några matchade böcker:", matchedTitles.slice(0, 10));

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function cleanTitle(title) {
  return normalizeTitle(title)
    .replace(/:\s*a novel$/i, "")
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .trim();
}

const normalizedBestbookTitles = new Set(
  allBooks.map(book => normalizeTitle(book.book_title))
);

const normalizedMatches = [...uniqueTitles].filter(title =>
  normalizedBestbookTitles.has(normalizeTitle(title))
);

console.log("Matchningar efter normalisering:", normalizedMatches.length);

const unmatchedTitles = [...uniqueTitles].filter(title =>
  !normalizedBestbookTitles.has(normalizeTitle(title))
);

console.log("Antal som inte matchade:", unmatchedTitles.length);
console.log("Exempel på böcker som inte matchade:");
console.log(unmatchedTitles.slice(0, 20));

const searchTerm = "A Man Called Ove";

const searchResults = allBooks
  .filter(book =>
    normalizeTitle(book.book_title).includes(normalizeTitle(searchTerm))
  )
  .map(book => book.book_title);

console.log("Sökresultat för A Man Called Ove:");
console.log(searchResults);

const cleanedBestbookTitles = new Set(
  allBooks.map(book => cleanTitle(book.book_title))
);

const cleanedMatches = [...uniqueTitles].filter(title =>
  cleanedBestbookTitles.has(cleanTitle(title))
);

console.log("Matchningar efter cleanTitle:", cleanedMatches.length);

const ratingsByYear = {};

books.forEach(book => {
  const year = book.Year;
  const rating = Number(book["User Rating"]);

  if (!ratingsByYear[year]) {
    ratingsByYear[year] = [];
  }

  ratingsByYear[year].push(rating);
});

const averageRatingsByYear = Object.entries(ratingsByYear).map(
  ([year, ratings]) => {
    const average =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    return {
      year: year,
      averageRating: Number(average.toFixed(2))
    };
  }
);

console.log("Genomsnittligt betyg per år:");
console.log(averageRatingsByYear);