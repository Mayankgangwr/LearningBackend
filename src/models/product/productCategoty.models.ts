import mongoose, { Schema } from "mongoose";
import { productCategotyModel } from "./interface";

const productCategotySchema = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true }
},
    {
        timestamps: true
    }
);

const ProductCategoty = mongoose.model<productCategotyModel>("ProductCategoty", productCategotySchema);

export default ProductCategoty;