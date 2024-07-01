import mongoose, { Model, Schema } from 'mongoose';
import { IRestaurant } from "./interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const restaurantSchema: Schema<IRestaurant> = new mongoose.Schema({
    displayName: { type: String, required: true },
    username: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9]+$/ },
    password: { type: String, required: true },
    imageUrl: { type: String },
    managerName: { type: String },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
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

restaurantSchema.methods.generateRefereshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET || "D2DDDC74FD7D3F6FD138F36EDCF18",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1d"
        }
    )
}
const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;