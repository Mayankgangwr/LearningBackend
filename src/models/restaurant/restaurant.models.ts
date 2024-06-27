import mongoose, { Schema } from 'mongoose';
import { restaurantModel } from "./interface";

const restaurantSchema: Schema = new mongoose.Schema({
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

const Restaurant = mongoose.model<restaurantModel>("Restaurant", restaurantSchema);

export default Restaurant;