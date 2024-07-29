import { Request } from "express";

export interface IAccessToken {
    _id: string;
    displayName: string;
    username: string
    role: string;
}
export interface AuthRequest extends Request {
    user?: any;
}

export enum Roles{
    SuperAdmin,
    Restaurant,
    Worker,
}