import { Request} from "express";
import type User from "./model/user";
type BlogInfo = {
    isOwner?: boolean;
    owner?: string;
}


interface LwRequest extends Request{
    user?: User;
    isAuthorized?: boolean;
    blogInfo?: BlogInfo;

}