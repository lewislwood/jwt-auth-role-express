import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../../mylib";
import express from "express";
import {hasRoles} from "../../middleware/roles";

import {validUserRoute} from "../../middleware/validUserRoute";
import {getController, postController} from "../../controllers/role";

export const route= express.Router();


route.use( validUserRoute) 
route.route("/*")
.get( hasRoles(["lunch_lady"])  , getController) 
// Block owner from changing themselves
.post( hasRoles(["lunch_lady"],"block" ), postController);


