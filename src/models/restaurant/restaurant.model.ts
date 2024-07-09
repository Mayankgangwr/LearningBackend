import mongoose, { Model, Schema } from 'mongoose';
import { IRestaurant } from "./interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const restaurantSchema: Schema<IRestaurant> = new mongoose.Schema<IRestaurant>({
    displayName: { type: String, required: true },
    username: { type: String, required: true, unique: true, },
    password: { type: String, required: true },
    avatar: { type: String },
    coverImage: { type: String },
    managerName: { type: String },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    refreshToken: { type: String, default: undefined },
    status: { type: Boolean, required: true, default: true }
},
    {
        timestamps: true
    }
);

restaurantSchema.pre<IRestaurant>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (err: any) {
        next(err);
    }
});

restaurantSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

restaurantSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            displayName: this.displayName,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET || "D2DDDC74FD7D3F6FD138F36EDCF18",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
    )
}


restaurantSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET || "99558DF847436FBCAFA92FA1EF1DD",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d"
        }
    )
}
const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;