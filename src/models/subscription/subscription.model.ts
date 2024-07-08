import mongoose, { Model, Schema } from "mongoose";
import { ISubscription } from "./interface";

const subscriptionSchema: Schema<ISubscription> = new mongoose.Schema<ISubscription>(
    {
        restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
        price: { type: Number, required: true },
        status: { type: Boolean, required: true },
    },
    {
        timestamps: true
    }
);

const Subscription: Model<ISubscription> = mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export default Subscription;