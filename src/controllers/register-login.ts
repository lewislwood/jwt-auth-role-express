import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";
import { AppError } from "../middleware/error-handlers";


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {setRoles ,createUser, findUser , rolesList, usersList}  from "../model/user";
import { nextTick } from "process";


export const registerController = async (req:Request, res:Response, next: NextFunction) => {
  try {
    // Get user input
    const  email = req.body.email as string , password = req.body.password as string;

    // Validate user input
    if ((!email)||(! password )) {
    const msg = "All input is ___  fields: " + JSON.stringify(req.body);
      return next(new AppError(400, msg));
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await findUser( email );

    if (oldUser) {
      return next(new AppError (400, "User Already Exist. Please Login"));
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const newUser = await createUser(email,encryptedPassword   );
    

    // Create token
    const tk = process.env.TOKEN_KEY;
    const token = jwt.sign(
      { _id: newUser._id, 
        email: newUser.email },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: process.env.token_exp as string,
      }
    );    
    // save user token
    newUser.token = token;
    return res.status(201).json(newUser);
  } catch (err) {
return next(err);
  }
};


export const loginController =async (req:Request, res:Response, next: NextFunction) => {
    try {
      // Get user input
      const email = req.body?.email as string, password = req.body?.password as string;   
  
      // Validate user input
      if ((!email) ||(!password)) {
        const msg = "All input is ___  fields: " + JSON.stringify(req.body);
        return next( new AppError(400, msg ))
      }
      // Validate if user exist in our database
      const user = await findUser( email );
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { _id: user._id,roles: user.roles, email: user.email },
          process.env.TOKEN_KEY as string,
          {
            expiresIn: process.env.token_exp as string,
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        return res.status(200).json(user);
      }
      return next( new  AppError(400, "Invalid Credentials"));
    } catch (err) {
return next(err);    }
  };
