
import {  response, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {  LwRequest } from "../mylib";
import {User, findUser, getGuestUser, RolesItem} from "../model/user";;

dotenv.config();


const config = process.env;

export const verifyToken = (req:LwRequest, res:Response, next:NextFunction) => {
  const token =  req.headers["x-access-token"] || req.body.token || req.query.token || req.params.token ;
  req.isAuthorized = (token) ? true: false;
  if (req.isAuthorized) {
  try {
    const decoded:User= jwt.verify(token, config.TOKEN_KEY as string) as User;
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({"status": 401,"text":"Invalid Token"});
  }; //catch
} else {
    // Login as Guest
    const gu  = getGuestUser();
    req.user = gu;
}
  return next();
}; //verifyToken

export const isAuthorized= (req:LwRequest, res:Response, next:NextFunction) => {
if (! req.isAuthorized) {
    return res.status(403).json("Not Authorized.");
}
    return next();
}; //isAuthorized


export const hasRole =(validRoles: RolesItem[])  => {
return (req:LwRequest, res:Response, next:NextFunction) => {
  const uRoles: RolesItem[]  = req.user.roles;

  // Admin has all roles automatically
  if (uRoles.includes("admin")) return next();
  uRoles.forEach((r)  => {
    if (validRoles.includes(r)) return next();
  });
  // Do not have a valid Role
  const msg = `Access denied. You must have role${(validRoles.length > 1) ? "(s)": ""}${validRoles.join(", ")}.`
  return res.status(403).json(msg);
};
  }; //hasRole
  
  

  export const ownerOrRole=(validRoles: RolesItem[])  => {
    return (req:LwRequest, res:Response, next:NextFunction) => {
      // Only retrieve blogInfo once
      if (!req.blogInfo) {
      const ps = req.url.slice(1).split("/");
      if (ps.length === 0) return res.status(301).json({"status": 301, "text": "Bad URL Must supply valid user.","body":"Bad URL Must supply valid user."});
      const email = ps[1].toLowerCase();
    const user =  findUser(email);
    if (! user) return res.status(223).json({"status":223,"text": "No such user blog found!", "body": "No such user blog found!"});

      req.blogInfo = { isOwner: (req.user.email === user.email), owner: user.email}
      }; // if ! req.blogInfo
      if (req.blogInfo.isOwner)  return next();

// Not the owner see if authorized.
      const uRoles: RolesItem[]  = req.user.roles;
    
      // Admin has all roles automatically
      if (uRoles.includes("admin")) return next();
      uRoles.forEach((r)  => {
        if (validRoles.includes(r)) return next();
      });
      // Do not have a valid Role
      const msg = `Access denied. You must have role ${(validRoles.length > 1) ? "(s)": ""}${validRoles.join(", ")}.`
      return res.status(223).json({
        status: 403,
        text: msg
      });
    };
      }; //ownerOrRole
      