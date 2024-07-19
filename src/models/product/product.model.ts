import mongoose, { Model, Schema, Types } from "mongoose";
import { IProduct } from "./interface";

const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    restroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory", // Fixed typo: ProductCategoty -> ProductCategory
      required: false,
    },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    avatar: { type: String },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;
