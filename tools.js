const data = require('./medium.com-feed-flutter');
const fs = require('fs').promises;
const cheerio = require('cheerio');

async function download() {

    generateIndex();

    for (const item of data.items) {
        downloadBlogs(item);
    }

}

const generateIndex = async () => {

    try {
        const index = await fs.readFile('./Templates/index_template.html');
        let indexString = index.toString();

        const contenct = getIndexContent();
        indexString = indexString.replace('index-place', contenct);

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

const getIndexContent = () => {
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