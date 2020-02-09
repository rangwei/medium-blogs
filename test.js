const cheerio = require('cheerio');

const file = require('./medium.com-feed-flutter');

// console.log(file.items[0].description);

$ = cheerio.load(file.items[0].description);

const text = $('p').text();

console.log(text);