import { Document } from 'mongoose';
export interface IRestaurant extends Document {
  displayName: string;
  username: string;
  password: string;
  avatar: string;
  managerName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  refreshToken: string;
  status: boolean;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}