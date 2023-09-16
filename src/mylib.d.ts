import { Request} from "express";
import type user from "./model/user";
import internal from "stream";


interface LwRequest extends Request{
    user?: CurrentUser;
    isAuthorized?: boolean;

}