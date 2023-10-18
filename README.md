# JWT-Auth Express API

This project is the begginnings of an API Authentification Token based system.

This API provides no sanitization of input, vo input validation of any sorts.  For example: I am inputting a user name for email for my testing purposes.  It does everything in memory, so restart server and tests will start over. (No users/tokens issued/registered).

 Only requirement is NodeJs. There are 4 scripts to launch various options.

+ npm run watch   // Will run compiler for Typescript changes
+ npm run dev  // runs the api server on port 3000
+ npm run test  // runs the javascript file runs a bunch of tests and generate a tests.log file
+ npm run token // Generates a token for you to place in the .env if you choose

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
 4. rename .env-sample to .env  
 5. type: npm run token  // generates a token to .token file. copy it to the .env file
 6. Now checkout the branch you want to play with. "git checkout auth" // The first branch

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

--------

### Role Authorization Branch

Role branch crates support for authorization. The web token payload includes the roles as well, this way the app does not have to keep looking them up.  Now the user does not get the new roles until they login again. An advanced Hexercise would be to create an authentication token server and buffering invalid tokens so that you can check quickly for this condition and automatically inform the client he/she must re-login. High security settings would appreciate this feature.

Guest are still not authenticated, but are issue a role of guest. There may be a reason you may want unregistered users to access certain content. The app curently supports the following roles ["registered", "editor", "lunch_lady", "admin"] .
The admin role is automatically assigned to the first user that registers and registered to all others. You can use the path "/role/<user>" to assign roles (Only "lunch_lady" & "admin" can do this).
You cannot assign "guest" role to anyone, it is a virtual role.

I have two paths that  support blogs & role. You append a user email to the end of the path. Now I call it email, but none of my tests enter valid emails, they are just first names (this is testing after all).
I call this user after the blog or role as owner.  After all lewis owns the blog "/blog/lewis".  So you will find that I add a routeInfo to the reques object and determine who is the owner of the route.

This branch also introduces route specific sub authenticatification. The "/blog" & the "/role" routes implemet their own routers. This way I can suthenticate and not interfer with other routes with my authrization middleware. I use hasRoles([roles...], owner access ( allow || ignore || block)) this middle ware determines what roles have access and if the owner has access or if it does not matter.  Default owner is ignore (who cares otherwise).

Note: * Token payload contains roles in string format. This is for training purposes. Production you should use codes (numbers) and map them appropiately. Also use enumerators. Makes request smaller and code smaller in size.

Note: ** I left a http error to show up in the console/terminal. The next branch I will not only clean up the app.ts file and move the controller logic/code to a controllers folder.  I will add custom error handling logic that express implements.


-------

### MVC (Model View Controller) Branch

This is the final branch of the API demo. The MVC branch places all routes under api with controllers broken out and under the controllers folder.  An auth folder has been created under the API folder. This is where all authentification related items are placed. This is common practice and centrallizes the auth code so that swapping out internal token provider, o-auth providers, web site authentication, your own auth server.  All controllers are async for optimal performance. Logging, tracing, request logging have all been implemented.

Authentification token seperated out, because it is the standard seems to be. Also this allows the maximum versatillity. You simply add your code and other providers to the auth folder under API and your off.

Async fully implemented. Why is this important? Javascript is naturally a blocking script. While it is waiting for something no-one else gets a turn on this Javascript machine. Async allows it to say "Hey I will wait and someone else can have a turn at this CPU." Nodejs handles this life cycle for javascript for you. Without async and just 1 CPU you are quite limited to perhaps only 1,xxx simultaneous connections.  That is assuming you have good code and without a lot of CPUU hording code. Async allows a single CPU to support as many as 10,000 simultaneous connections (optimal). This was the ceiling for the longest time til worker threads came around and load balancers. So a 16 CPU machine can support about million+ connections simultaneously.  So async is important if you plan on developing something like a game or conferencing platform.

Logging using Winston and Morgan to log request/response.  Logger.ts is located under config/logger.ts. The default logging level is debug, but in production environments it goes down to warning level and errors only. Utilizes the standard enviroment variable NODE_ENV that you will find in the .env file . I use screen reader and decided to use simple format and placed the time at the end of line. Production I would do otherwise, of course. Morgan has a flag in the .env file that turns on request logging or not. You can also move it around and custom routes. Great for if you are trying to track performance.

The error logging feature works like a champ and is quite versatile. The logging handling and logging is handled by the middleware/errorHandllers.ts.ErrorLog will decide how to log the error or debug. Two filters are available here, besides node_dev under logger.ts. There the it is done unkown to this errorLog middleware. 

Environment filter by error names is done in the .env file. I have created a few Error classes. You can filter them out and focus on particular types. Also I have an include force status codes. Say you want all forbidden Roles, yt RoleError is being filtered. This will give it to you. Imagination you can use route logging in addition and modify this errorLog to detect that the error has already been logged so ignore, simply by adding a flag to the new error classes.

ErrorRsponse. Handles sending back a response back to the client so they know what is going on and what happened. It is typically the last item .

This API is almost ready to snap into a web API infrastructure. Only requires a few minor alterations to make it a world class ready web public API.  Your Roles need to be numbers. SSL certificates from a domain encrypted ssl certificate. CORS rules and much more. This is an API so a refresh token system is not as neccessary, nor are cookies. Those become important if you bring in anFront end in addition. 
Check out below for the additional resources.  Happy coding..
