import { Request, response, NextFunction, Response } from "express";
import express from "express";
import { LwRequest } from "./mylib";

// middleware
import {verifyToken  as auth } from "./middleware/role-auth";
import {hasRoles} from "./middleware/roles";

// Controllers
import {registerController , loginController } from "./controllers/register-login";
import {homeController } from "./controllers/home";
import {welcomeController } from "./controllers/welcome";
import {invalidController } from "./controllers/invalid";
import {usersListController } from "./controllers/users-list";

 export const app = express();

 app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "50mb" }));
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

app.use("/blog", require("./blog-route"));
app.use("/role", require("./blog-route"));

// This should be the last route else any after it won't work
app.use("*",invalidController );
 