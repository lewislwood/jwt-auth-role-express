import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";

export const homeController =  async (req:LwRequest, response:Response) => {
    response.status(200).send({"status": 200, "body": "Availailable Routs\n /welcome  \n /userslist"});
  };