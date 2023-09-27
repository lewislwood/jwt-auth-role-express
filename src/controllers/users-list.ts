import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";
import {usersList}  from "../model/user";

export const usersListController = (req:LwRequest, res:Response) => {
    const ul = usersList();
    res.status(201).send( { "status": 201, "isAuthorized": true,"body":`Users List is ${ul}.`});
    };