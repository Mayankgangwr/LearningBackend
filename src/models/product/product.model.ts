import mongoose, { Model, Schema } from "mongoose";
import { IProduct } from "./interface";

const productSchema: Schema<IProduct> = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategoty", required: true },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    avatar: { type: String, required: true },
    status: { type: Boolean, required: true },
},
    {
        timestamps: true
    }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default Product;