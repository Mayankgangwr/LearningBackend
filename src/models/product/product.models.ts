import mongoose, { Schema } from "mongoose";
import { productModel } from "./interface";

const productSchema = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategoty", required: true },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    status: { type: Boolean, required: true },
},
    {
        timestamps: true
    }
);

const Product = mongoose.model<productModel>("Product", productSchema);

export default Product;