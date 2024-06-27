import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: [true, "Already existing this category"],
            required: [true, "Enter category name! can't be empty"]
        },
        restroId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model("Category", categorySchema);


export default Category;