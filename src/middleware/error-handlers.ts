import { response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";

import {logger} from "../model/logger";

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
    console.log(`${request.method} url:: ${request.url}`);
    next()
}


export class AppError extends Error{
    statusCode: number;

    constructor(statusCode: number, message: string) {
      super(message);
  
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = "AppError";""
      this.statusCode = statusCode;
      Error.captureStackTrace(this);
    }
}


export const errorLogger = (error: AppError, request: LwRequest, response: Response, next: NextFunction) => {
  const status = (error.statusCode) || 500;
  let msg = `${error.name}:${status} ${error.message}`;
  const logMode = (error.name === "error") ? "error" : "info";
    logger.log(logMode , msg);
    
    next(error) // calling next middleware
}
  
export const errorResponder = (error: AppError, request: LwRequest, response: Response, next: NextFunction) => {
  response.header("Content-Type", 'application/json')
    
  const status = error.statusCode || 500
  const message = `LW: ${status} ${error.name}: ${error.message}`
  response.status(status).json({
    status, 
    message
  })
}

