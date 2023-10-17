import {  response, NextFunction, Response } from "express";
import {  LwRequest } from "../mylib";
import { AppError } from "../middleware/error-handlers";

import {RolesItem} from "../model/user";import { logger } from "../config/logger";
;


type OwnerAccess = "ignore" | "allow" | "block";
class RoleError extends AppError{
  constructor( status: number,  message: string) {
      super(status, message );
      // Object.setPrototypeOf(this, new.target.prototype);
      this.name = "RoleError";
      this.statusCode = status;
};
};



export const hasRoles =(validRoles: RolesItem[],ownerAccess: OwnerAccess = "ignore")  => {
    return (req:LwRequest, res:Response, next:NextFunction) => {
      try {
        if (ownerAccess !== "ignore") {
if (! req.routeInfo) {
    logger.warn("You must first call vallidUserRoute to set routeInfo on request object.\n Unable to check if user is owner of this route");
} else {
const ri = req.routeInfo;
// Only proccess owner Access if owner
if (ri.isOwner) {

  if (ownerAccess === "allow") return next();
  // Must be block
  // console.log("Owner Blocked.");
  return next(new RoleError(403, "Owners are denied access to self"));
};
}; // routeInfo
}; // if ownerAccess != ignore
        const uRoles: RolesItem[]  = req.user.roles;
    
      // Admin has all roles automatically
      if (uRoles.includes("admin")) return next();
      let isValid = false;
      validRoles.forEach((r)  => {
        if (uRoles.includes(r)) isValid = true;
      });
      if (isValid) return next();
      // Do not have a valid Role
      const msg = `Access denied. You must have role${(validRoles.length > 1) ? "(s)": ""} ${validRoles.join(", ")}.`;
      return next(new RoleError(401, msg));
  } catch(error: any) {
    return next(error);
  }; //catch
  return next();  // should not get here.
}; // return (req,res,next) =>
      }; //hasRole