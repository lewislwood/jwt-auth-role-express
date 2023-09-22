import {  response, NextFunction, Response } from "express";
import {  LwRequest } from "../mylib";
import {User, findUser, getGuestUser, RolesItem} from "../model/user";;


export const validUserRoute= (req:LwRequest, res:Response, next:NextFunction) => {
// Only retrieve routeInfo once
if (!req.routeInfo) {
    const ps = req.url.slice(1).split("/");
    if (ps.length === 0) return res.status(301).json({"status": 301, "text": "Bad URL Must supply valid user.","body":"Bad URL Must supply valid user."});
    const email = ps[0].toLowerCase();
  const user =  findUser(email);
  if (! user) return res.status(223).json({"status":223,"text": "No such user blog found!", "body": "No such user blog found!"});
  
    req.routeInfo= { isOwner: (req.user.email === user.email), owner: user}
    }; // if ! req.routeInfo
    return next();  
  

};; // validUserRoute
