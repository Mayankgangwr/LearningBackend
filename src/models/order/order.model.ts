import mongoose, { Model, Schema } from "mongoose";
import { IOrder, IOrderedProduct } from "./interface";

const itemSchema: Schema<IOrderedProduct> = new mongoose.Schema<IOrderedProduct>({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const orderSchema: Schema<IOrder> = new mongoose.Schema<IOrder>({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    statusId: { type: mongoose.Schema.Types.ObjectId, ref: "OrderStatus", required: true },
    items: [itemSchema],
    customerName: { type: String, required: true },
    tableNumber: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
},
    {
        timestamps: true
    }
)


const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;