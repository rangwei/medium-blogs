const express = require('express');
const tools = require('./tools');

const app = express();

const PORT = process.env.PORT || 3000;

setInterval(tools.download, 1200000); //60000*20 = 1200000

app.use(express.static(__dirname + '/public'));

app.listen(PORT);