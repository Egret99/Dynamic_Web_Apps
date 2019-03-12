const util = require('util');
const Twit = require('twit');
const config = require('./config.js');
const exec = util.promisify(require('child_process').exec);
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

yargs.parse();

//create the Twit object
const T = new Twit(config);


//read text and write the text into the file
const writeContent = async (content) => {
    const contentObj = {
        content
    };
    
    const contentJSON = JSON.stringify(contentObj);

    console.log("Writing your text content to the file...");
    
    await fs.writeFileSync('painter/data/content.json', contentJSON);

    console.log("Finished writing the content!")
}

const executeProcessing = async (content) => {
    const cmd = 'processing-java.exe --sketch=painter --run';

    console.log("Running processing to generate the picture...");

    await exec(cmd, async () => {
        console.log("Finished running and picture generated!");
        await postImage(content);
        console.log("Finished Posting");
    });
}

const postImage = async (content) => {
    const imgPath = path.join(__dirname, 'painter/pic.png');
    const b64content = fs.readFileSync(imgPath, {encoding: 'base64'});

    console.log("Uploading the image...");

    await T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        if(err){
            console.log(`Erorr: ${err}`);
        }else{
            console.log("Finished uploading the image!");
            console.log("Posting it...");

            const mediaIdStr = data.media_id_string;
            const altText = `Visualization of current trending topic - ${content}.`;
            const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

            T.post('media/metadata/create', meta_params, function (err, data, response) {
                if (err) {
                  console.log(`Error: ${err}`);
                }else{
                    // now we can reference the media and post a tweet (media will attach to the tweet)
                    const params = { status: `${content}`, media_ids: [mediaIdStr] }
                
                    T.post('statuses/update', params, function (err, data, response) {
                        console.log("Finished posting!");

                        console.log("Opening the browser...");

                        exec("explorer https://twitter.com/", (err, stdout, stdin) => {
                            // if(err){
                            //     console.log(err);
                            // }

                            console.log("Check this tweet!")
                        })
                    });
                }
            })
        }
    });
}

const postTrendingtagImage = async () => {
    console.log("Getting Trending Hashtag...");

    let hashtag;

    const params = {
        id: 1
    }
    
    await T.get('trends/place', params, async (err, data, response) => {
        if(!err){
            //console.log(data[0].trends[]);
            const topic = data[0].trends[0].name;
            console.log(`Trending topic right now: ${topic}`);
            await writeContent(topic);

            await executeProcessing(`Trending topic right now: ${topic}`);
        }else{
            console.log(err);
        }
    });
}

// execute the program
postTrendingtagImage();

setInterval(() => {
    postTrendingtagImage();
}, 600000);