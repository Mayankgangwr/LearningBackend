import mongoose, { Document, Types } from "mongoose";


export interface IOrderedProduct extends Document {
    productId: Types.ObjectId;
    price: number;
    quantity: number;
};

export interface IOrder extends Document {
    restroId: Types.ObjectId;
    statusId: Types.ObjectId;
    items: IOrderedProduct[];
    customerName: string;
    customerNumber: string;
    tableNumber: number;
    totalAmount: number;
};

export interface IOrderStatus extends Document {
    restroId: Types.ObjectId;
    displayName: string;
};
