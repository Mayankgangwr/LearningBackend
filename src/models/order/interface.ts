import { Document } from "mongoose";


export interface orderedProductModel {
    productId: string;
    price: number;
};

export interface orderModel {
    restroId: string;
    statusId: string;
    items: orderedProductModel[];
    customerName: string;
    tableNumber: number;
    totalAmount: number;
};

export interface orderStatusModel {
    restroId: string;
    displayName: string;
};
