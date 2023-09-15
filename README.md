# JWT-Auth Express API

This project is the begginnings of an API Authentification Token based system.

This API provides no sanitization of input, vo input validation of any sorts.  For example: I am inputting a user name for email for my testing purposes.  It does everything in memory, so restart server and tests will start over. (No users/tokens issued/registered).

 Only requirement is NodeJs. There are 3 scripts to launch various options.

+ npm run watch   // Will run compiler for Typescript changes
+ npm run dev  // runs the api server on port 3000
+ npm run test  // runs the javascript file runs a bunch of tests and generate a tests.log file

Each runs in a different terminal.

## Typical Develop Cycle

I like to run the Typescript watch in one terminal. Nothing I hate more than wondering why my code is still not working.  The watch makes sure code is recompiled immediately. That leaves it up to me to restart the server to incorporate the latest code.

1. Terminal 1: npm run watch
2. f5 for debug server launch file
3. terminal 2 : npm run test
4. Open file tests.log and see results of test run.

 Hint: You can clear the tests.log between runs.  Make sure to save changes. It will automatically repopulate the next test results When you run it. So leave it open. I like code edit window 3 ctrl+3.

 Now I can see terminal window for test errors. and Java console for server errors. ctrl+shift+y.

 -------

## Setup Instal this repo

 This repo has numerous branches and you will want to look at them in order. This way you can learn from them. If you are already confident and just want a starter template, then use the main and clone it only.

 1. Clone Repository "git clone [https://github.com/lewislwood/jwt-auth-role-express]"
 2. In the folder type "git fetch --all" // This will download all branches.
 3. Type "npm install"  // Installs depencies (dotenv,bcryptjs,express,typescript,winston
 4. rename .env-sample to .env  // you really should generate your own unique token key *see below*) I know I am not using this key, but others may
 5. Now checkout the branch you want to play with. "git checkout auth" // The first branch

Braches are [main, auth, role, final]  

-------

## Branches

Three other branches besides the "main branch" which is the final branch all cleaned up.

### Auth Branch

Auth branch is the basic authentification branch. The beginnings of an authentification system.

You can switch to it this way:

~~~~ git checkout auth

Startup script is index.ts, but the app.ts is where the code is.  App.ts I have left the route, controller code there for your ease of reviewing. Normally controller code is placed elsewhere, under a sub-folder controllers. I will do this in the final branch.

Routes /register & /login both issue tokens. This is a service and will be moved as well later. Note the payload I defined is User id & email, later I will put the roles here as well in the next branch. You are free to put any info in the payload as you wnt, not too large though. This way the info is with the request and requires no lookup (especially in real world you will have a database query).  This is an api so typically you would set the token for a short time (2 hours).  Now in a more complicated system you would use refresh tokens as well and perhaps oauth providers like google, facebook. That is beyond this example.

Auth.ts is where the verifyToken code is stored and does it's magic.  If the token is valid it is decoded and placed on the request object as a user object.  Which is the payload defined earlier.  Currently to illustrate I put the auth on the 2 routes that require authentification. Do not worry the auth only gets called once, on the route that matches. If verification fails res.send(.... will end the processing and return the error to the client.  If it passes it is passed on the next chain in the route. 
  In the role I will move the auth to a app.use( auth  // just above the authenticatification routes. Since role based authentification will need the payload to hold the role.

Test.js has 3 primary test functions. RegisterLogin,tokenAuth, & TokenExpire. Feel free to comment any test y9ou do not want to perform.  Review the output in the tess.log file. This demonstrates the number of tests that are needed to write a good api. This is usually performed by api clients like Postman and others. They use defined collections of tests/requests.

-------

## Generating a Random Token Key

I provide two ways to generate a random token key

### Generate via OpenSSL

  This requires OpenSSL installed, which is the case for most Linux installations.

 ~~~~~ $ openssl rand -base64 32

Copy the output as your token key.

### Token via Node

This one requires Nodejs, which the project requires as well. Simply go to your terminal and enter the nodejs interactive session by entering:

~~~~~ node

Now in the node_ prompmpt enter:

~~~~ require("crypto").randomBytes(64).toString("hex") //token outputed

 This will output a 64 byte hex code token.

 ---------
