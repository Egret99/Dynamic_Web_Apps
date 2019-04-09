const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const auth = async (req, res, next) => {
    const username = req.body.name.trim();
    try {
        const usersStr = await readFile('users.json', 'utf-8');
        if(usersStr) {
            users = JSON.parse(usersStr);
            const usernames = Object.keys(users);
            if(usernames.includes(username)) {
                if(users[username] === req.body.psw) {
                    req.login = true;
                } else {
                    req.login = false;
                    req.msg = "Password not correct.";
                }
            } else {
                req.login = false;
                req.msg = "Username doesn't exist.";
            } 
        }else {
            req.msg = "Username doesn't exist.";
        }

    } catch(err) {
        req.login = false;
        req.msg = "Unable to connect to the server.";
    }

    next();

};

module.exports = auth;