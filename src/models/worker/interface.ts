import mongoose, { Document } from "mongoose";
export interface IWorker extends Document {
  roleId: mongoose.Schema.Types.ObjectId;
  shiftId: mongoose.Schema.Types.ObjectId;
  restroId: mongoose.Schema.Types.ObjectId;
  displayName: string;
  username: string;
  password: string;
  position: string;
  avatar: string;
  phoneNumber: string;
  dob: number | null;
  aadharCard: string | null;
  panCard: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  refreshToken: string;
  isLoggedIn: boolean;
  status: boolean;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IWorkerRole extends Document {
  restroId: mongoose.Schema.Types.ObjectId;
  displayName: string;
  status: boolean;
}

export interface IWorkerShift extends Document {
  restroId: mongoose.Schema.Types.ObjectId;
  displayName: string;
  status: boolean;
}
