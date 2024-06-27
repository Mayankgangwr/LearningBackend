import mongoose, { Schema } from "mongoose";
import { workerModel } from "./interface";

const workerSchema: Schema = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkerRole", required: true },
    shiftId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkerShift", required: true },
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    position: { type: String, required: true },
    imageUrl: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Number, required: true },
    aadharCard: { type: String, required: true },
    panCard: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    isLoggedIn: { type: Boolean, required: true },
},
    {
        timestamps: true
    }
);

const Worker = mongoose.model<workerModel>("Worker", workerSchema);

export default Worker;