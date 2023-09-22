import { Request, response, NextFunction, Response } from "express";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {setRoles ,createUser, findUser , rolesList, usersList}  from "./model/user";
import {verifyToken  as auth } from "./middleware/role-auth";
import {hasRoles} from "./middleware/roles";
import {validUserRoute} from "./middleware/validUserRoute";

import {isAuthorized} from "./middleware/authorized";
import { LwRequest } from "./mylib";




 export const app = express();
 const blogRouter = express.Router();
 const roleRouter = express.Router();

 app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "50mb" }));

app.post("/register", async (req:Request, res:Response) => {
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
      { user_id: newUser._id, 
        email },
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
});


app.post("/login", async (req:Request, res:Response) => {
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
        { user_id: user._id,roles: user.roles, email },
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
});
app.get("/", (req:LwRequest, response:Response) => {
  response.status(200).send({"status": 200, "body": "Availailable Routs\n /welcome  \n /userslist"});
});

//  Now authenticate and set role
app.use( auth);

app.get("/welcome", hasRoles(["registered"]),(req:LwRequest, res:Response) => {
  const user = (req?.user)? req.user.email : "";
  res.status(201).send( { "status": 201, "isAuthorized": true,"body":`Welcome ${user} 🙌 `});
}); 

app.get("/userslist", hasRoles(["guest"]),(req:LwRequest, res:Response) => {
const ul = usersList();
res.status(201).send( { "status": 201, "isAuthorized": true,"body":`Users List is ${ul}.`});
});
app.use("/blog", blogRouter);
blogRouter.use( validUserRoute,  hasRoles(["registered","editor"], true)) //Only Owner
blogRouter.route("/*", )
.get(  (req:LwRequest, res:Response) => {
  return res.status(201).json({"status": 201,"body": `You are now viewing ${req.routeInfo?.owner} blog.`});
})
.post( hasRoles(["editor"], true), (req:LwRequest, res:Response) => {
const text = req.body.text;
return res.status(201).json({
  status: 201,
  body: `Blog entry successfully posted:()   ${text}).`
});
});

app.use("/role", roleRouter)
roleRouter.use( validUserRoute,  hasRoles(["lunch lady"], false) ); 
roleRouter.route("/*")
.get((req:LwRequest, res:Response) => {
  const owner =  req.routeInfo?.owner;
  return res. status(201).json({"status": 201,
  "body": `${owner.email} has the following ${(owner.roles.length > 1)? "roles are": "role is"} ${owner.roles.join(", ")} .`
});
})
.post((req:LwRequest, res:Response) => {
  const owner =  req.routeInfo?.owner, newRoles = req.body.roles;
  const user = setRoles( owner.email, newRoles);
  if (! user) return res.status(401).json({
    "status": 401,
    "text": "invalid user"
  });
  return res. status(201).json({"status": 201,
  "body": `${user.email} has changed to ${(newRoles.length > 1)? "roles are": "role is"} ${user.roles.join(", ")} .`
});

});

// This should be the last route else any after it won't work
app.use("*", (req:Request, res:Response) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});


