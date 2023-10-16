const { type } = require('os');


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
      users[result.email] = result.token;
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
else logger.info(result.message);
} else {
  console.log( result.statusText);
  logger.info(result.statusText);
}
} catch(error) {
console.log(`testRoute${route} : `,error.message);
}; //catch

  
return result;
  } ; // testRoute

  async function testRoutePost(route, postBody, user) {
    const url = baseURL +route ;
    let  tk,  result, theBody;
    if ((typeof  postBody )  === "string") theBody = {"text": postBody}  
    else theBody = postBody;
    let config= { 
      method: "POST", 
      headers: { "Content-Type": "application/json"}, 
      mode: "same-origin",
      body : JSON.stringify(theBody )     
    };
      if (user) {
    tk = users[user.toLowerCase()];
    if (! tk)  lastToken = null; // invalid user so no token on purpose ... clear lastToken as well
      } else tk = lastToken;
  if (tk) config.headers["x-access-token"] = `${tk}`; 
  
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
  } ; // testRoutePost

  function wait(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
  logger.info(`Waiting for ${ms/1000} seconds.`);
        resolve(ms)
      }, ms )
    })
  }  ; // wait



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
   logger.info("*** Finished Registration Tests & Login Tests *****\n");
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



  logger.info("*** Finished Token Auth Tests***** \n");
}; // tokenAuthTests


async function tokenExpiresTest() {
  let result;

  logger.info(" **** Starting Token Expire Test *****");
  logger.info("Register Lewis then Login just in case already registered.");
  result =await  testRegister("lewis", "letmein007");
  logger.info("Login Lewis to get token, just in cae already registered earlier")
  result =await  testLogin("lewis", "letmein007");


  logger.info("Testing authenticated route /welcome ");
  result = await testRoute("/welcome", "lewis" );

  logger.info("Note: token_exp value is set in the .env file for the server. ");
  logger.info("Will now wait 30 seconds and test again..");
  await wait(30 * 1000);

  logger.info("Testing authenticated route /welcome ");
  result = await testRoute("/welcome", "lewis" );
  logger.info("*** Finished Token Expires Test  *****\n");
} ; // tokenExpiresTest
const testRoles = async () => {
  let result;
  logger.info("*** Start roles routes  *****");
  logger.info("Registering 3 users Lewis, Paris, Peggy")
  result =await  testRegister("lewis", "letmein007");
  result =await  testRegister("Paris", "spinach");
  result =await  testRegister("Peggy", "cabbageSoup");
  logger.info("Now logging each user Lewis, Paris, Peggy. Since server may have already registered them so no token returned via register");
  result = await testLogin("lewis", "letmein007");
  result = await testLogin("Paris", "spinach");
  result = await testLogin("peggy", "cabbageSoup");

  logger.info("Listing Roles with user lewis as admin");
  result = await testRoute("/userslist", "lewis");
  logger.info("Testing /welcome route with user lewis as admin");
  result = await testRoute("/welcome", "lewis");
  logger.info("Testing /welcome route with user Paris as registered user");
  result = await testRoute("/welcome", "paris");
  logger.info("Testing /welcome route with user Guest as Guest ");
  result = await testRoute("/welcome", "guest");
  logger.info("Listing Roles with user Paris as registered user");
  result = await testRoute("/userslist", "paris");
  logger.info("Listing Roles with user guest user");
  result = await testRoute("/userslist", "guest");


logger.info("*** begining blog route test  ***");

  logger.info("Peggy posting to Paris's blog");
  await testRoutePost("/blog/paris","Wow Paris I can post here by Peggy a registered user.", "peggy");
  logger.info("Viewing Blog for Lewis by Lewis");
  result = await testRoute("/blog/lewis", "lewis");
  logger.info("Viewing Blog for fake by Lewis");
  result = await testRoute("/blog/fake", "lewis");
  logger.info("Viewing Blog for paris by fake");
  result = await testRoute("/blog/paris", "fake");
  logger.info("Viewing Blog for paris by peggy");
  result = await testRoute("/blog/paris", "peggy");

  logger.info("Granting Paris editor role by Lewis (admin)")
  await testRoutePost("/role/paris", {"roles": ['editor']},"lewis");
  logger.info("Paris is now attempting to post to peggy as editor, but she needs to relogin to get role update");
  await testRoutePost("/blog/peggy", "Hi Peggy from Paris.", "paris");
  await testLogin("Paris", "spinach");
  logger.info("Paris is now posting  to peggy as editor");
  await testRoutePost("/blog/peggy", "Hi Peggy from Paris.", "paris");


  logger.info("*** Finished Roles tests*****\n");
} ; // testRoles

const testSetRoles = async () => {
  logger.info("Registering 5 users Lewis, Paris, Pegg, jessica, joey")
  await  testRegister("lewis", "letmein007");
  await  testRegister("Paris", "spinach");
  await  testRegister("Peggy", "cabbageSoup");
  await  testRegister("joe", "fishing");  
  await  testRegister("jessica", "pineapples");

await testLogin("lewis", "letmein007");
  await testLogin("Paris", "spinach");
await testLogin("peggy", "cabbageSoup");
await  testLogin("joe", "fishing");  
  await  testLogin("jessica", "pineapples");

  logger.info("Users Registered and login tokens issued for each. Now begin setRoles Tests");

  logger.info("Displaying Userlist with roles for everyone by Lewis (admin) first registered");
  await testRoute("/userslist", "lewis");

logger.info ("Displaying roles for jessica");
  await testRoute("/role/jessica", "lewis")
  logger.info ("Lewis changing roles for peggy (Roles: 'admin' test");
  await testRoutePost("/role/peggy", {roles: ["lunch_lady"]}, "lewis")
  logger.info ("Lewis Displaying roles for peggy (Roles: 'admin' test");
  await testRoute("/role/peggy", "lewis")
  await testLogin("peggy", "cabbageSoup");

  logger.info ("PeggyDisplaying roles for peggy (Roles: 'lunch lady' test");
  await testRoute("/role/peggy", "peggy")
  logger.info ("Peggy is changing roles for paris (Role: 'lunch lady' test");
  await testRoutePost("/role/paris", {roles: ["editor"]}, "peggy")
  logger.info ("Paris is changing roles for Jessica(Role: 'editor' test");
  await testRoutePost("/role/jessica", {roles: ["editor"]}, "paris")
  logger.info ("Peggyis changing roles for Peggy(Role: 'lunch lady' Trying to grant admin to herself");
  await testRoutePost("/role/peggy", {roles: ["admin", "lunch lady"]}, "peggy")
  logger.info ("Peggy is changing roles for joe(Role: 'lunch lady' Trying to grant alunch ladyto herself");
  await testRoutePost("/role/joe", {roles: ["admin", "lunch_lady"]}, "peggy")
await  testLogin("joe", "fishing");  
logger.info("Joe displaying his own roles")
await testRoute("/role/joe", "joe")
logger.info("Joe is displaying roles for all");
await testRoute("/userslist", "joe");
  


  logger.info("***** Finished testSetRoles  ********")



}; // testSetRoles

async function doTests() {
  let result;

  // Simply comment out any test yyou do not want to test right now.
  await testRoute("/mytest", "lewis");

  result = await registerLoginTests();

  result = await tokenAuthTests();


await tokenExpiresTest(); 

await testRoles ()

await testSetRoles();

}; // doTests
  
doTests();

