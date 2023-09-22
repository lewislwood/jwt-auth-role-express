import { Request} from "express";
import type User from "./model/user";
type RouteInfo= {
    isOwner?: boolean;
    owner?: User;
}


interface LwRequest extends Request{
    user?: User;
    isAuthorized?: boolean;
    routeInfo?: RouteInfo;

}