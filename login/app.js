const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const config = require('./config');

admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: "https://teammate-666d2.firebaseio.com"
});

const db = admin.database();

const app = express();
const auth = require('./auth');

app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    let msg;

    await db.ref('users').once('value', snap => {
        snap.forEach(childSnap => {
            //console.log("stored: " + )
            if (childSnap.val().name === req.body.name) {
                msg = "Username has been used.";
            }
        })
    });

    if (!msg) {
        try {
            const encryptedPsw = await bcrypt.hash(req.body.psw, 8);
            const user = await db.ref('users').push ({
                name: req.body.name.trim(),
                password: encryptedPsw
            });
            
            msg = "Thank you for registering.";
        } catch(err) {
            console.log(err);
            msg = "Unable to connect to the server.";
        }
    }
    

    res.render('index', {
        msg
    });

});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/me', (req, res) => {
    db.ref('users').once('value', async snap => {
        let storedPsw;
        snap.forEach(async (childSnap) => {
            if (childSnap.val().name === req.body.name.trim()) {
                storedPsw = childSnap.val().password;
            }
        });

        const isAuth = await bcrypt.compare(req.body.psw, storedPsw);

        if(isAuth) {
            res.render('dashboard.hbs', {
                username: req.body.name
            })
        } else {
            res.send("Umanle to authenticate");
        }
    })
});

app.listen(3000, () => {
    console.log("App running at 3000")
});