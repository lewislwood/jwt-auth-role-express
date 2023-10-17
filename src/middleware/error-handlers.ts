import { response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";
import {logger} from "../config/logger";
import dotenv from "dotenv";


let config:any ;
// ignore logging these items
const ignoreNames: {[key:string]: boolean } = {};
const includeCodes : {[key:string]: boolean } = {};



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


export const errorLogger = (error: Error| AppError, request: LwRequest, response: Response, next: NextFunction) => {
  const name = error.name.toLowerCase(); 
  let igNore = false;
  if (ignoreNames[name]) igNore = true;
  let logMode = (name === "error") ? "error" : "debug";
  // @ts-ignore
  let status = (logMode === "debug") ? error?.statusCode : 500;
  if (! status) {status = 500;logMode = "error";}
  if ((igNore) && (includeCodes[`${status}`]))  igNore = false;
  if (! igNore ) {

  let msg = `${error.name}:${status} ${error.message}`;

  logger.log({
    level: logMode,
    message: msg
  });
  }; // if ignore
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
log_exc_error_names
*/

{
  dotenv.config();
  config = process.env;
  const names = config.log_exc_error_names;

  if ( names ) {
const nList = names?.toLowerCase().trim().split(",") || [];
nList?.forEach((v: string) =>{ ignoreNames[v] = true;});
  }
  ;
  //includeCodes 
  //log_inc_error_codes
  const codes= config.log_inc_error_codes;

  if ( codes) {
const nList = codes?.trim().split(",") || [];
nList?.forEach((v: string) =>{ includeCodes [v] = true;});
  }
  ;
  
}