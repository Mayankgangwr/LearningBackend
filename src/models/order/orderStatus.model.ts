import mongoose, { Model, Schema } from "mongoose";
import { IOrderStatus } from "./interface";

const orderStatusSchema: Schema<IOrderStatus> = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true }
},
    {
        timestamps: true
    }
);

const OrderStatus: Model<IOrderStatus> = mongoose.model<IOrderStatus>("OrderStatus", orderStatusSchema);

export default OrderStatus;