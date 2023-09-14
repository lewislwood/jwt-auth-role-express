

const logger = require('./logger')();

const users = {};
const baseURL = "http://localhost:3000";

let lastToken;


const buildRequest     = (body)=> {
  let myBody = body, jsRequest, myHeaders = { "Content-Type": "application/json"};
  if (! body) myBody = {} ;
  jsRequest = {
      method: "POST",
      headers: myHeaders,
      // mode: "same-origin",
      body : JSON.stringify(myBody),
      };

  return jsRequest ;
      }; // buildRequest
    
async function runFetch(url, req) {
const result =await fetch(url, req).then(res => {
  return res.json();
  // return result;
}); //fetch
return result ;
}; // runFetch

async function testLogin( user, password) {
  const url = baseURL + "/login";
    const data =      {"email": user, "password":password};
    const req  = buildRequest(data)
    const result = await runFetch(url, req);
    if (result?.token) {
      logger.info("Login token saved.");
      const email = user.toLowerCase();
      users[email] = result.token;
      lastToken = result.token;
    } else {
      logger.info(result);
    };
return result;
};  // testLogin()

async function testRegister( user, password) {
  const url = baseURL + "/register";
    const data =      {"email": user, "password":password};
    const req  = buildRequest(data)
    const result = await runFetch(url, req);
    if (result.token) {
      logger.info("Registration token saved.");
      const email = user.toLowerCase();
      users[email] = result.token;
      lastToken = result.token;
    }  else {
      logger.info(result);
    };
return result;
};  // testRegister()

async function testRoute(route, user) {
  const url = baseURL +route ;
  let  tk,  result, config;
    if (user) {
  tk = users[user.toLowerCase()];
  if (! tk)  lastToken = null; // invalid user so no token on purpose ... clear lastToken as well
    } else tk = lastToken;
if (tk) config = { method: "GET" ,headers:{ "x-access-token" : `${tk}`}  }; 

try {
result = await   fetch( url, config);
if (result.ok) {
result =await  result.json();
if ((result.status) < 299) logger.info( result.body)
else logger.info(result.text);
} else {
  console.log( result.statusText);
  logger.info(result.statusText);
}
} catch(error) {
console.log(`testRoute${route} : `,error.message);
}; //catch

  
return result;
  } ; // testRoute



async function registerLoginTests() {
  let result;
  logger.info("*** Start Registration Tests & Login Tests *****");

  logger.info("Registering lewis");
  result =await  testRegister("lewis", "letmein007");

  logger.info("ReRegistering lewis");
  result =await  testRegister("lewis", "letmein007");


  logger.info("Login Lewis with valid credentials");
   result =await  testLogin("lewis", "letmein007");
   logger.info("Login Lewis with inValid credentials");
   result =await  testLogin("lewis", "letmein099");

   logger.info("Registering Paris");
  result =await  testRegister("Paris", "spinach");
  logger.info("Login Paristh ");
   result =await  testLogin("Paris", "spinach");
   logger.info("Login Paristh  with inValid credentials");
   result =await  testLogin("Paris", "broccoli");
   logger.info("*** Finished Registration Tests & Login Tests *****");
};  // registerLoginTests

async function tokenAuthTests() {
  let result;
  logger.info("*** Start tokenAuthTestsTests & *****");
  logger.info("Registering 3 users Lewis, Paris, Peggy")
  result =await  testRegister("lewis", "letmein007");
  result =await  testRegister("Paris", "spinach");
  result =await  testRegister("Peggy", "cabbageSoup");
  logger.info("Now logging each user Lewis, Paris, Peggy. Since server may have already registered them so no token returned via register");
  result = await testLogin("lewis", "letmein007");
  result = await testLogin("Paris", "spinach");
  result = await testLogin("peggy", "cabbageSoup");

  logger.info("Testing /welcome route with user lewis");
  result = await testRoute("/welcome", "lewis");
  logger.info("Testing testRoute with no user specified forcing test to use lastToken");
  result = await testRoute("/welcome" );
  logger.info("Testing testRoute with fake user specified forcing test to clear lastToken and use no token.");
  result = await testRoute("/welcome", "fake" );
  logger.info("Testing testRoute with no user specified forcing test to use lastToken, which is no token");
  result = await testRoute("/welcome" );
  logger.info("Testing /welcome with PaRIis");
  result = await testRoute("/welcome", "PaRIs" );

  logger.info("Testing '/'  the home route/");
  result = await testRoute("/" );
  logger.info("Testing /userslist  route/");
  result = await testRoute("/userslist" , "lewis");



  logger.info("*** Finished Token Auth Tests*****");
}; // tokenAuthTests


async function doTests() {
  let result;
  // result = await registerLoginTests();

result = tokenAuthTests();

}; // doTests
  
doTests();
