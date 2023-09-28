import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";
import express from "express";
import {setRoles ,rolesList}  from "../model/user";


export const getController = (req:LwRequest, res:Response) => {
    const owner =  req.routeInfo?.owner;
    return res. status(201).json({"status": 201,
    "body": `${owner.email} has the following ${(owner.roles.length > 1)? "roles are": "role is"} ${owner.roles.join(", ")} .`
  });
};

export const postController = (req:LwRequest, res:Response) => {
    const owner =  req.routeInfo?.owner, newRoles = req.body.roles;
    const user = setRoles( owner.email, newRoles);
    if (! user) return res.status(400).json({
      "status": 401,
      "text": "invalid user"
    });
    return res. status(201).json({"status": 201,
    "body": `${user.email} has changed to ${(newRoles.length > 1)? "roles are": "role is"} ${user.roles.join(", ")} .`
  });
};

  