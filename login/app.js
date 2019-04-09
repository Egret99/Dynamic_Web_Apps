const express = require('express');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();
const auth = require('./auth');

app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    let msg = "";
    
    try {
        const usersStr = await readFile('users.json', 'utf-8');
        let users = {};
        if(usersStr) {
            users = JSON.parse(usersStr);
            const usernames = Object.keys(users);
            if(usernames.includes(req.body.name.trim())) {

                return res.render('index', {
                    msg: "This username has already been used."
                });
            }
        }
        
        users[req.body.name.trim()] = req.body.psw;   
        await writeFile('users.json', JSON.stringify(users));
        res.render('index', {
            msg: "Thank you for registering."
        });

    } catch(err) {
        msg = "Unable to connect to the server.";
    }

});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/me', auth, (req, res) => {
    if(req.login) {
        res.render('dashboard', {
            username: req.body.name
        });
    }else {
        res.render('login', {
            msg: req.msg
        })
    }
});

app.listen(3000, () => {
    console.log("App running at 3000")
});