
import { Request, response, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const config = process.env;

export const verifyToken = (req:Request, res:Response, next:NextFunction) => {
  const token =  req.headers["x-access-token"] || req.body.token || req.query.token || req.params.token ;

  if (!token) {
    return res.status(403).send({"status": 403, "txt": "Token required"});
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY as string);
    // @ts-ignore comment, you can tell the TypeScript compiler to skip over the line of code that's causing the error and move on to the next
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({"status": 403,"text":"Invalid Token"});
  }; //catch
  return next();
}; //verifyToken


