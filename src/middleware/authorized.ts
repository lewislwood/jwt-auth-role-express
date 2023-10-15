import {  response, NextFunction, Response } from "express";
import {  LwRequest } from "../mylib";
import { AppError } from "../middleware/error-handlers";

export const isAuthorized= (req:LwRequest, res:Response, next:NextFunction) => {

    if (! req.isAuthorized) {
          return next(new AppError(403, "Not Authorized")); 
    }
        return next();
    }; //isAuthorized