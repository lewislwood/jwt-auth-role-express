import {  response, NextFunction, Response } from "express";
import {  LwRequest } from "../mylib";

export const isAuthorized= (req:LwRequest, res:Response, next:NextFunction) => {

    if (! req.isAuthorized) {
        return res.status(403).json("Not Authorized.");
    }
        return next();
    }; //isAuthorized