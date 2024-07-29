import mongoose, { Model, Schema } from "mongoose";
import { IProductCategory } from "./interface";

const productCategorySchema: Schema<IProductCategory> = new mongoose.Schema<IProductCategory>({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true }
},
    {
        timestamps: true
    }
);

const productCategory: Model<IProductCategory> = mongoose.model<IProductCategory>("ProductCategory", productCategorySchema);

export default productCategory;