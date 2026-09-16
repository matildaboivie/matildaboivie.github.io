const fs = require("fs");
const { parse } = require("csv-parse/sync");

// Läs in båda dataseten
const amazonCSV = fs.readFileSync(
  "bestsellers with categories.csv",
  "utf8"
);

const goodreadsCSV = fs.readFileSync(
  "bestbooks.csv",
  "utf8"
);

// Gör CSV-filerna till data
const amazon = parse(amazonCSV, {
  columns: true,
  skip_empty_lines: true
});

const goodreads = parse(goodreadsCSV, {
  columns: true,
  skip_empty_lines: true
});

// Enkel funktion för att matcha titlar
function cleanTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// Räkna hur många gånger varje bok finns på bestsellerlistan
const amazonBooks = {};

amazon.forEach(book => {
  const title = cleanTitle(book.Name);

  if (!amazonBooks[title]) {
    amazonBooks[title] = {
      name: book.Name,
      appearances: 0
    };
  }

  amazonBooks[title].appearances++;
});

// Matcha med Goodreads
const matches = [];
const usedTitles = new Set();

goodreads.forEach(book => {
  const title = cleanTitle(book.book_title);

  if (amazonBooks[title] && !usedTitles.has(title)) {
    matches.push({
      title: amazonBooks[title].name,
      appearances: amazonBooks[title].appearances,
      rating: Number(book.book_rating)
    });

    usedTitles.add(title);
  }
});

// Skriv ut resultatet
console.log(`Antal matchade böcker: ${matches.length}`);
console.log(JSON.stringify(matches, null, 2));