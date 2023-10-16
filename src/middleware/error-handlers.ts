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


export const errorLogger = (error: Error, request: LwRequest, response: Response, next: NextFunction) => {
  const logMode = (error.name === "AppError") ? "info" : "error";
  //@ts-ignore
  const status = (logMode === "info") ? error.statusCode : 500;
  let msg = `${error.name}:${status} ${error.message}`;

    if (logMode === "info") {
      logger.info( msg); 

    }else {
  logger.error( msg);
    }
    next(error); // calling next middleware

    
}; // errorLogger
  
export const errorResponder = (error: AppError, request: LwRequest, response: Response, next: NextFunction) => {
  try {
  response.header("Content-Type", 'application/json')
    
  const status = error.statusCode || 500
  let message = (status < 500)   ? `LW: ${status} ${error.name}: ${error.message}` : `Server error:   ${error.message}`;
    response.status(status).json({
    status, 
    message
  })
} catch(err:any) {
  logger.error("Error in error: "+ error.message)
}; // catch
}; // errorResponder 



/*
List of http Error codes I am interested in


400  Bad Request
401 UnAuthorized
403  forbidden
404 Not Found 
"ERR_HTTP_HEADERS_SENT"
*/