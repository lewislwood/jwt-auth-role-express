import { Request, response, NextFunction, Response } from "express";
import { LwRequest } from "../mylib";
import { AppError } from "../middleware/error-handlers";
import {logger}   from "../config/logger";

class TestError extends AppError{
    constructor( message: string) {
        super(400 , message );
        // Object.setPrototypeOf(this, new.target.prototype);
        this.name = "TestError";
        this.statusCode = 401;
};
};


// This is a quick controler where I throw in some quick test code
// So this code changes based on what I am currently testing.
// I placed the route in the app.ts file
//  That route calls this controller
//

export const myTestController = (req:LwRequest,res:Response, next: NextFunction) => {

// logger.error("I am testing error" );
    const mval = 42;
// @ts-ignore  Tell Typescript to ignore obvious error so I can test error handling
    mval .crazyError();
    return next(new TestError("Lewis has an error"));

res.send("I am going crazy");
};
