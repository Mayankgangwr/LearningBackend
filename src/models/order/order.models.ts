import mongoose, { Schema } from "mongoose";
import { orderModel } from "./interface";

const itemSchema: Schema = new mongoose.Schema({
    proId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const orderSchema: Schema = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    statusId: { type: mongoose.Schema.Types.ObjectId, ref: "OrderStatus", required: true },
    items: [itemSchema],
    customerName: { type: String, required: true },
    tableNumber: { type: String, required: true },
    totalAmount: { type: Number, required: true },
},
    {
        timestamps: true
    }
);

const Order = mongoose.model<orderModel>("Order", orderSchema);

export default Order;