import mongoose, { Model, Schema } from "mongoose";
import { IPlan } from "./interface";

const planSchema: Schema<IPlan> = new mongoose.Schema<IPlan>(
    {
        displayName: { type: String, required: true, unique: true },
        duration: { type: Number, required: true },
        mrp: { type: Number, required: true },
        price: { type: Number, required: true },
        status: { type: Boolean, required: true, default: true },
    },
    {
        timestamps: true
    }
);

const Plan: Model<IPlan> = mongoose.model<IPlan>("Plan", planSchema);

export default Plan;