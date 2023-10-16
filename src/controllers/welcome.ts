import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";

export const welcomeController = (req:LwRequest, res:Response) => {
    const user = (req?.user)? req.user.email : "";
    res.status(201).json( { "status": 201, "isAuthorized": true,"body":`Welcome ${user} 🙌 `});
  }; 
    