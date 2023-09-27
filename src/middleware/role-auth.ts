
import {  response, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import {  LwRequest } from "../mylib";
import {User, findUser, getGuestUser, RolesItem} from "../model/user";;

dotenv.config();


const config = process.env;

export const verifyToken = (req:LwRequest, res:Response, next:NextFunction) => {
  const token=  req?.headers["x-access-token"];  // Below is some of the other common ways to pass tokens.  I only utilize one of them. 
  // || req.body.token || req.query.token || req.params.token ;

  req.isAuthorized = (token) ? true: false;
  if (req.isAuthorized) {
  try {
    // @ts-ignore
    const decoded = jwt.verify(token, config.TOKEN_KEY as string);
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

  
  
