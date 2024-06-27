import mongoose, { Schema } from "mongoose";
import { orderStatusModel } from "./interface";

const orderStatusSchema = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true }
},
    {
        timestamps: true
    }
);

const OrderStatus = mongoose.model<orderStatusModel>("OrderStatus", orderStatusSchema);

export default OrderStatus;