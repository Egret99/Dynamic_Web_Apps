const Twit = require('twit');
const config = require('./config.js');

const T = new Twit(config);

const getTodayDateString = () => {
    const date = new Date();
    let month = date.getMonth() + 1;
    if(month < 10){
        month = "0" + month.toString();
    }
    const dateString = `${date.getFullYear()}-${month}-${date.getDate()}`;
    
    return dateString;
}

const getUsersBirthdayTweet = () => {
    const date = getTodayDateString();
    console.log(date);

    const q = `birthday since:${date}`;

    console.log("Extracting tweets with birthday key word.");

    T.get('search/tweets', { q, count: 15 }, function(err, data, response) {
        const tweets = data.statuses;

        console.log("Tweets found, extracting user names...");

        const users = tweets.map(item => {
            const userNames = item.entities.user_mentions.map(user => user.screen_name);
            return userNames;
        });

        console.log("Found users: ");
        console.log(users);
        
        sendHappyBirthdayTwits(users);
      })
}

const sendHappyBirthdayTwits = users => {
    console.log("Generating Tweet content...");
    let content = "Happy birthday to you guys! "
    
    users.forEach(item => {
        if(item.length > 0){
            item.forEach(user => {
                content += `@${user} `;
            });
        }
    })

    console.log("Content generated.");
    console.log("Content: " + content);

    T.post('statuses/update', { status: content }, function(err, data, response) {
        console.log(data)
      })
};

getUsersBirthdayTweet();