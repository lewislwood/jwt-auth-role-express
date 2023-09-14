import { Request} from "express";
import internal from "stream";

interface CurrentUser {
    id: number;
    email : string;
    token: string;
} 

interface LwRequest extends Request{
    user?: CurrentUser;
    isAuthorized?: boolean;

}