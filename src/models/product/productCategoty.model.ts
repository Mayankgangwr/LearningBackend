import mongoose, { Model, Schema } from "mongoose";
import { IProductCategoty } from "./interface";

const productCategotySchema: Schema<IProductCategoty> = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true }
},
    {
        timestamps: true
    }
);

const ProductCategoty: Model<IProductCategoty> = mongoose.model<IProductCategoty>("ProductCategoty", productCategotySchema);

export default ProductCategoty;