import {  response, NextFunction, Response } from "express";
import {  LwRequest } from "../mylib";
import {RolesItem} from "../model/user";;


type OwnerAccess = "ignore" | "allow" | "block";

export const hasRoles =(validRoles: RolesItem[],ownerAccess: OwnerAccess = "ignore")  => {
    return (req:LwRequest, res:Response, next:NextFunction) => {
      try {
        if (ownerAccess !== "ignore") {
if (! req.routeInfo) {
    console.log("You must first call vallidUserRoute to set routeInfo on request object.\n Unable to check if user is owner of this route");
} else {
const ri = req.routeInfo;
// Only proccess owner Access if owner
if (ri.isOwner) {

  if (ownerAccess === "allow") return next();
  // Must be block
  // console.log("Owner Blocked.");
  return res.status(304).json({
    "status": 304,
    "text": "You are not allowed to access self."
  });
  
};  // if ri.isOwner
}; // routeInfo
}; // if ownerAccess != ignore
        const uRoles: RolesItem[]  = req.user.roles;
    
      // Admin has all roles automatically
      if (uRoles.includes("admin")) return next();
      validRoles.forEach((r)  => {
        if (uRoles.includes(r)) return next();
      });
      // Do not have a valid Role
      const msg = `Access denied. You must have role${(validRoles.length > 1) ? "(s)": ""} ${validRoles.join(", ")}.`
      // console.log(msg);
return res.status(201).json({})      .json({
        "status": 201, 
        "text": `Access denied. You must have role${(validRoles.length > 1) ? "(s)": ""} ${validRoles.join(", ")}.`
      });
  } catch(error: any) {
    if (error.code != "ERR_HTTP_HEADERS_SENT"){
console.log("hasRoles error: %s", error.message);
  };
  }; //catch
}; // return (req,res,next) =>
      }; //hasRole