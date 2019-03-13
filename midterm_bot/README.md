#Trending Topic Image Twitter Bot
## About
This Trending Topic Image Twitter Bot will automatically grab the hottest topic on twitter and put the text into a processing program that generates a painting that is the visualization of the text.

This bot is created with Node.js, Twit dependency, and Processing.
## How to Use
The bot is will post every 10 minutes. After downloading the directory, run `npm init` in a terminal with the pathway of the directory, put your config information from Twitter API inside the config.js file. 

After that,for Windows users, run `node app`  in the terminal. For Mac users, please install processing-java inside processing. Then replace `processing-java.exe` with `processing-java`. and ```--sketch=`pwd`/painter```. Then replace `explorer https://twitter.com/` with `open https://twitter.com/`.

Note: See [Twit Documentation](https://www.npmjs.com/package/twit) to see structure and more info.
## Know Bugs/Future Fixes
- When running command line `explorer https://twitter.com/` on windows, it sometimes will catch error, but that doesn't affect the bot from running.
