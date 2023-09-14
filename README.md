# JWT-Auth Express API

This project is the begginnings of an API Authentification Token based system.

This API provides no sanitization of input, vo input validation of any sorts.  For example: I am inputting a user name for email for my testing purposes.  It does everything in memory, so restart server and tests will start over. (No users/tokens issued/registered).

 Only requriement is NodeJs. There are 3 scripts to launch various options.

+ npm run watch   // Will run compiler for Typescript changes
+ npm run dev  // runs the api server on port 3000
+ npm run test  // runs the javascript file runs a bunch of tests and generate a tests.log file

Each runs in a different terminal. (ctrl+shift+~)

## Generating a Random Token Key

I provide two ways to generate a random token key

### Token via Node

This one requires Nodejs, which the project requires as well. Simply go to your terminal and enter the nodejs interactive session by entering:

~~~~~ node

Now in the node_ prompmpt enter:

~~~~ node_ 
require("crypto").randomBytes(64).toString("hex")

 This will output a 64 byte hex code (token)
 
### Generate via openSSL

 
  This requires OpenSSL installed, which is the case for most Linux installations.``

 ~~~~~ $ openssl rand -base64 32

Copy the output as your token key.


How to generate a random token key for thisexample;
$openssl rand -base64 32

The above will output a token. Copy it intoyour .env file
