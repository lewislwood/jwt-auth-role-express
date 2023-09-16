
import {  response, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {  LwRequest } from "../mylib";
import {User, getGuestUser} from "../model/user";;
import type user from  "assert"
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
    return res.status(401).send({"status": 403,"text":"Invalid Token"});
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


