const express = require("express");
const fs = require('fs');

fs.readFile("data.json", (err, data) => {
    if(err) {
        return console.log("File access error.");
    }

    const dataStr = data.toString();
    let dataObj = {};

    if(dataStr.length > 0) {
        dataObj = JSON.parse(dataStr);
    }

    const app = express();

    app.get('/', (req, res) => {
        res.send(
            "<p>Access all data by route /data</p><p>Save data by adding words to the routes (two needed)</p>"
            );
    });

    app.get('/data', (req, res) => {
        res.send(dataObj);
    })
    
    app.get('/:name/:property', (req, res) => {
        const {name, property} = req.params;

        dataObj[name] = property;
        const updatedData = JSON.stringify(dataObj, null, 2);
        fs.writeFile('data.json', updatedData, (err) => {

            if(err){
                return res.send("File access error.");
            }

            res.send(`Property added! Check /data to see!`);
            
        });
    })
    
    app.get('*', (req, res) => {
        res.send("Page not found.");
    })
    
    app.listen(3000, () => {
        console.log("App on port 3000");
    })
});