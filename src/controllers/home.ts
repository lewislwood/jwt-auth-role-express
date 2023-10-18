import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";

export const homeController =  async (req:LwRequest, response:Response) => {
  const routes = [
    `Available Routes:`,
    `/  Home route displays available routes.  Unrestricted`,
    `/mytest  Developer wildcard test.  Unrestricted`,
    `/welcome  Displayes welcome message.  Registered user.`,
    `/blog/username  Display the blog for a user.  Registered Users only. `,
    `/blog/username  Post a blog .  Must be Editor or Wner of the blog.`,
    `/role/username  Displays Roles for that username.  Lunch LadyOnly, UserName cannot change their own role  `,
    `/userslist  Displays list of users and their roles.  Guest Only.  Crazy right~ lol`,
    `Admin has all priveleges. First user registered is automatically garanted admin role. PS.- Do not piss off the luch lady she will change your role ! lol`
  ].join(" \n ");
    response.status(200).send({"status": 200, "body": routes});
  };