import { Request, response, NextFunction, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {setRoles ,createUser, findUser , rolesList, usersList}  from "../model/user";
import { LwRequest } from "../mylib";


export const registerController = async (req:Request, res:Response) => {
  try {
    // Get user input
    const  email = req.body.email as string , password = req.body.password as string;

    // Validate user input
    if ((!email)||(! password )) {
    const msg = "All input is ___  fields: " + JSON.stringify(req.body);
    res.status(200).send("User Page");
      res.status(401);
      // .json(msg);
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await findUser( email );

    if (oldUser) {
      return res.status(409).json("User Already Exist. Please Login");
      console.log("User alread exists.");
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
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(501).json("Server error");
  }
};


export const loginController =async (req:Request, res:Response) => {
    try {
      // Get user input
      const email = req.body?.email as string, password = req.body?.password as string;   
  
      // Validate user input
      if ((!email) ||(!password)) {
        const msg = "All input is ___  fields: " + JSON.stringify(req.body);
        res.status(400).json(msg);
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
      return res.status(400).json("Invalid Credentials");
    } catch (err) {
      console.log("/login error: ", err);
    }
  };
