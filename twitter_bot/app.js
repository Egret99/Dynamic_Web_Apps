const Twit = require('twit');
const config = require('./config.js');

var T = new Twit(config);


const tweets = (ts = []) => {
    const randomInd = Math.floor(Math.random()*ts.length);
    console.log(ts[randomInd]);
    console.log(randomInd);
    T.post('statuses/update', { status: ts[randomInd] }, function(err, data, response) {
        console.log(data.text);
    });
}

const ts = ["Hahaha", "Hehehe", "Hohoho", "aaa"];

setInterval(function(){
    tweets(ts);
}, 10000);