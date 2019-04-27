# Login Page
## About
This is an app that renders a page for user to register and login after registering. The user data will be saved on firebase. If the username has been repeated, it would prompt the user that the name has been used. After registration, the user will not be automatically redirected to login. The user needs to manually login in. This app also used bcrypt to encrypt the password.

## How to Use
After downloading, run npm install to install dependencies. Put your firebase credentials in the config.js file. Remmeber to create the users collection in firebase. Then run `node app.js` and check http://localhost:3000.