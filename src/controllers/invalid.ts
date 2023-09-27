import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";


export const invalidController = (req:Request, res:Response) => {
    res.status(404).json({
      success: "false",
      message: "Page not found",
      error: {
        statusCode: 404,
        message: "You reached a route that is not defined on this server",
      },
    });
  };
  