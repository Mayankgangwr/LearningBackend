import { Request } from "express";
export interface IAccessToken {
    _id: string;
    displayName: string;
    username: string
}
export interface AuthRequest extends Request {
    user?: any;
}