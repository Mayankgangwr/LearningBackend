import mongoose, { Document, Types } from "mongoose";
// Ensure IProduct extends Document to get mongoose functionalities
export interface IProduct extends Document {
  restroId: Types.ObjectId;
  categoryId?: Types.ObjectId;
  displayName: string;
  description: string;
  mrp: number;
  price: number;
  avatar?: string;
  status?: boolean;
}
export interface IProductCategory extends Document {
    restroId: Types.ObjectId;
    displayName: string;
}