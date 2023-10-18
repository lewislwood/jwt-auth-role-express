const fs = require("fs");
const path = require("path");
const newToken =
 require("crypto").randomBytes(64).toString("hex") //Generates a new Token

 console.log(`Your new token is below on a line by itself:\n`);
 console.log(newToken);
 console.log(`\nToken is on line above`);

 const data = `Copy the token below to the .env file. \ntoken=${newToken}`;
 const tokenFile = path.resolve(__dirname, ".tokens");

 fs.writeFileSync(tokenFile, data);

 console.log(`Token also saved to: ${tokenFile}.`)

