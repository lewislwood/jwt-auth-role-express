import {  response, NextFunction, Response } from "express";
import {  LwRequest } from "../mylib";
import {RolesItem} from "../model/user";;

export const hasRoles =(validRoles: RolesItem[], allowOwner: boolean = false, blockOwner: boolean = false)  => {
    return (req:LwRequest, res:Response, next:NextFunction) => {
        if ((allowOwner) || (blockOwner)) {
if (! req.routeInfo) {
    console.log("You must first call vallidUserRoute to set routeInfo on request object.\n Unable to check if user is owner of this route");
} else {
     if ((allowOwner) &&(req.routeInfo.isOwner)) return next();
     if  ((blockOwner) &&( req.routeInfo.isOwner)) {
return res.status(403).json({
  status: 403,
  text: "You are forbidden"
})
     }            ;
}; // routeInfo
}; // allowOwner
        const uRoles: RolesItem[]  = req.user.roles;
      
    
      // Admin has all roles automatically
      if (uRoles.includes("admin")) return next();
      uRoles.forEach((r)  => {
        if (validRoles.includes(r)) return next();
      });
      // Do not have a valid Role
      const msg = `Access denied. You must have role${(validRoles.length > 1) ? "(s)": ""}${validRoles.join(", ")}.`
      return res.status(403).json(msg);
    };
      }; //hasRole