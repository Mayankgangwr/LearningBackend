import { Document } from "mongoose"

export interface ISuperAdmin extends Document{
    displayName: string;
    username: string;
    password: string;
    refreshToken: string;
    status: boolean
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}