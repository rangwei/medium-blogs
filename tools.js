// const data = require('./medium.com-feed-flutter');
const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');


const url = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fflutter';

async function download() {

    const resp = await axios.get(url);
    const data = resp.data;

    generateIndex(data);

    for (const item of data.items) {
        downloadBlogs(item);
    }

}

const generateIndex = async (data) => {

    try {
        const index = await fs.readFile('./Templates/index_template.html');
        let indexString = index.toString();

        const contenct = getIndexContent(data);
        indexString = indexString.replace('index-place', contenct);
        indexString = indexString.replace('date-place', Date());

        await fs.writeFile('./public/index.html', indexString);
        console.log('index.html completed.');
    } catch (e) {
        console.log(e);
    }
}

const downloadBlogs = async (item) => {

    const guid = item.guid.split('/').pop();
    const title = item.title;
    const description = item.description;
    try {
        const index = await fs.readFile('./Templates/blog_template.html');
        let indexString = index.toString();

        indexString = indexString.replace('title-place', title);
        indexString = indexString.replace('body-place', description);

        await fs.writeFile('./public/Flutter/' + guid + '.html', indexString);
        console.log(`${guid} completed.`);

    } catch (e) {
        console.log(e);
    }

}

const getIndexContent = (data) => {
    let content = "";

    for (const item of data.items) {
        content = content + getHeader(item) + '<br>\n<br>\n';
    }
    return content;
}

const getHeader = (item) => {

    const guid = item.guid.split('/').pop();

    const header = `<div class=\"mui--text-headline\">${item.title}</div>`;

    const author = `<div class=\"mui--text-black-54\">By ${item.author}, ${item.pubDate}</div>`;

    const description = getDescription(item.description);

    const body = `<div>${description}<a href=\"./Flutter/${guid}.html\"> Read more...</a></div>`;

    return `${header}\n<br>\n${author}\n<br>\n${body}\n<br>\n`;
}

const getDescription = (body) => {
    // const start = body.indexOf('<p>');
    // const desc = body.substring(start + 3, 400);

    $ = cheerio.load(body);
    const desc = $('p').text().substring(0, 400);

    return desc;
};

module.exports = {
    download
};