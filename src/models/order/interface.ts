import mongoose, { Document } from "mongoose";


export interface IOrderedProduct extends Document {
    productId: mongoose.Schema.Types.ObjectId;
    price: number;
    quantity: number;
};

export interface IOrder extends Document {
    restroId: mongoose.Schema.Types.ObjectId;
    statusId: mongoose.Schema.Types.ObjectId;
    items: IOrderedProduct[];
    customerName: string;
    tableNumber: number;
    totalAmount: number;
};

export interface IOrderStatus extends Document {
    restroId: mongoose.Schema.Types.ObjectId;
    displayName: string;
};
