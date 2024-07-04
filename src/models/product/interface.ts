import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
    restroId: mongoose.Schema.Types.ObjectId;
    categoryId: mongoose.Schema.Types.ObjectId;
    displayName: string;
    description: string;
    price: number;
    avatar: string;
    status: boolean;
}

export interface IProductCategoty extends Document {
    restroId: mongoose.Schema.Types.ObjectId;
    displayName: string;
}