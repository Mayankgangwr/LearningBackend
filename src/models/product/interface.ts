import { Document } from "mongoose";

export interface productModel extends Document {
    restroId: string;
    categoryId: string;
    displayName: string;
    description: string;
    price: number;
    imageUrl: string;
    status: boolean;
}

export interface productCategotyModel extends Document {
    restroId: string;
    displayName: string;
}