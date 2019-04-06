const path = require('path');
const hbs = require('hbs');
const express = require('express');

const app = express();
const router = require('./router');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(router);

app.listen(3000, () => {
    console.log('app running on 3000');
});