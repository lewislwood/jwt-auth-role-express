import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";
import express from "express";
import {hasRoles} from "../middleware/roles";
import {setRoles ,createUser, findUser , rolesList, usersList}  from "../model/user";


export const getController = (req:LwRequest, res:Response) => {
    const owner = req?.routeInfo?.owner;
    const email = (! owner) ?  "???": owner.email; 
    return res.status(201).json({"status": 201,"body": `You are now viewing ${email} blog.`});
  };


export const postController = (req:LwRequest, res:Response) => {
  const text = req.body?.text || "maybe body";
  return res.status(201).json({
    status: 201,
    body: `Blog entry successfully posted:()   ${text}).`
  });
  };
  
  