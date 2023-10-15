import {  response, NextFunction, Response } from "express";
import {  LwRequest } from "../mylib";
import {User, findUser, getGuestUser, RolesItem} from "../model/user";import { AppError } from "./error-handlers";
;


export const validUserRoute= (req:LwRequest, res:Response, next:NextFunction) => {
// Only retrieve routeInfo once
if (!req.routeInfo) {
    const ps = req.url.slice(1).split("/");
    if (ps.length === 0) return res.status(400).json({"status": 400, "text": "Bad URL Must supply valid user.","body":"Bad URL Must supply valid user."});
    const email = ps[0].trim().toLowerCase();
  const oUser=  findUser(email);
  if (! oUser) return next( new AppError(400, "No such user route found!"));
  
  const user = req.user as User;
  const  uEmail = user.email,  oEmail = oUser.email;
  const isEmail = (uEmail === oEmail);

    req.routeInfo= { isOwner: isEmail, owner: oUser}
    }; // if ! req.routeInfo
    return next();  
  

};; // validUserRoute
