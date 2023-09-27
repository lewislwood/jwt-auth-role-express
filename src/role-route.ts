import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "./mylib";
import express from "express";
import {hasRoles} from "./middleware/roles";
import {setRoles ,createUser, findUser , rolesList, usersList}  from "./model/user";

import {validUserRoute} from "./middleware/validUserRoute";

const route= express.Router();


route.use( validUserRoute) 
route.route("/*")
.get( hasRoles(["lunch_lady"])  , (req:LwRequest, res:Response) => {
  const owner =  req.routeInfo?.owner;
  return res. status(201).json({"status": 201,
  "body": `${owner.email} has the following ${(owner.roles.length > 1)? "roles are": "role is"} ${owner.roles.join(", ")} .`
});
})
// Block owner from changing themselves
.post( hasRoles(["lunch_lady"],"block" ),(req:LwRequest, res:Response) => {
  const owner =  req.routeInfo?.owner, newRoles = req.body.roles;
  const user = setRoles( owner.email, newRoles);
  if (! user) return res.status(400).json({
    "status": 401,
    "text": "invalid user"
  });
  return res. status(201).json({"status": 201,
  "body": `${user.email} has changed to ${(newRoles.length > 1)? "roles are": "role is"} ${user.roles.join(", ")} .`
});

});

module.exports = route;
