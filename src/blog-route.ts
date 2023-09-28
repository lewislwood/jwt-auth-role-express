import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "./mylib";
import express from "express";
import {hasRoles} from "./middleware/roles";
import {setRoles ,createUser, findUser , rolesList, usersList}  from "./model/user";

import {validUserRoute} from "./middleware/validUserRoute";
import {getController, postController} from "./controllers/blog";


export const route= express.Router();

// validUser Route must have a valid registered user to view
// Only registered users can access the blogs
route.use( validUserRoute,  hasRoles(["registered","editor"],"allow") )
route.route("/*", )
.get(getController)
// Owner and editor can edit a post
.post( hasRoles(["editor"], "allow"), postController);  


