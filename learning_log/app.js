const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views/templates"));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', (req, res) => {
    res.render('index', {
        title: "hbs",
        author: "Egret"
    })
});

app.get('/about', (req, res) => {
    res.render('index', {
        title: "About",
        author: "Egret"
    })
});

app.get('/help', (req, res) => {
    res.render('index', {
        title: "Help",
        author: "Egret"
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        author: "Egret"
    })
});

app.listen(3000, () => {
    console.log("App running on port 3000.");
});