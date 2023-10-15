import { Request, response, NextFunction, Response } from "express";
import express from "express";
import { LwRequest } from "./mylib";

// middleware
import {morganMiddleware  } from "./middleware/morgan";
import {errorResponder , errorLogger} from "./middleware/error-handlers";

import {verifyToken  as auth } from "./middleware/role-auth";
import {hasRoles} from "./middleware/roles";
import {route as blogRoute} from "./blog-route";

// Controllers
import {registerController , loginController } from "./controllers/register-login";
import {homeController } from "./controllers/home";
import {welcomeController } from "./controllers/welcome";
import {invalidController } from "./controllers/invalid";
import {usersListController } from "./controllers/users-list";
import {myTestController} from "./controllers/mytest";


 export const app = express();
 // Let us log the request.
//  const morganMiddleware  = require("./middleware/morgan");
//  app.use(morganMiddleware);

//  app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "50mb" }));


app.get("/mytest", myTestController );

app.post("/register", registerController  );
app.post("/login", loginController );

// Home route display list of available routes
app.get("/", homeController );

//  Now authenticate and set role
app.use( auth);
// Only registered users and admin con go here
app.get("/welcome", hasRoles(["registered"]),welcomeController );

// Only guest and admin can view users list and roles  (I know quite radical!  ha ha).

app.get("/userslist", hasRoles(["guest"]),usersListController );

app.use("/blog", blogRoute);
app.use("/role", require("./role-route"));
app.use( errorLogger);
app.use(errorResponder );

// This should be the last route else any after it won't work
app.use("*",invalidController );
 