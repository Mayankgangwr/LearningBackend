import mongoose, { Model, Schema } from "mongoose";
import { IWorker } from "./interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError";

// Define the worker schema
const workerSchema: Schema<IWorker> = new mongoose.Schema<IWorker>(
  {
    restroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkerRole",
      required: true,
    },
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkerShift",
      required: true,
    },
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    position: { type: String, required: true },
    avatar: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Number, default: null },
    aadharCard: { type: String, default: null },
    panCard: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    pincode: { type: String, default: null },
    refreshToken: { type: String, default: undefined },
    isLoggedIn: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the worker
workerSchema.pre<IWorker>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err: any) {
    next(err);
  }
});

// Method to compare passwords
workerSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
workerSchema.methods.generateAccessToken = function () {
  try {
    const token = jwt.sign(
      {
        _id: this._id,
        displayName: this.displayName,
        username: this.username,
      },
      process.env.WORKER_ACCESS_TOKEN_SECRET || "D2DCDC74FD7D3F6FD138F36EDFC81",
      {
        expiresIn: process.env.WORKER_ACCESS_TOKEN_EXPIRY || "1d",
      }
    );
    console.log("Access Token generated successfully:", token);
    return token;
  } catch (err) {
    console.error("Error generating access token:", err);
    throw new ApiError(500, "Failed to generate access token.");
  }
};

// Method to generate a refresh token
workerSchema.methods.generateRefreshToken = function () {
  try {
    const token = jwt.sign(
      {
        _id: this._id,
      },
      process.env.WORKER_REFRESH_TOKEN_SECRET || "95958DF847436FBCAFA92FA1ED1FD",
      {
        expiresIn: process.env.WORKER_REFRESH_TOKEN_EXPIRY || "2d",
      }
    );
    console.log("Refresh Token generated successfully:", token);
    return token;
  } catch (err) {
    console.error("Error generating refresh token:", err);
    throw new ApiError(500, "Failed to generate refresh token.");
  }
};

const Worker: Model<IWorker> = mongoose.model<IWorker>("Worker", workerSchema);

export default Worker;
