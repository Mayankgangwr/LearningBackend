import mongoose, { Schema } from "mongoose";
import { paymentModel } from "./interface";

const accountDetailsSchema: Schema = new mongoose.Schema({
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    ifscCode: { type: String, required: true },
});

const upiDetailsSchema: Schema = new mongoose.Schema({
    upiId: { type: String, required: true },
    upiTransactionId: { type: String, required: true },
});

const paymentSchema: Schema = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    transactionId: { type: String, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, required: true },
    payableAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    accountDetails: { type: accountDetailsSchema, required: false },
    upiDetails: { type: upiDetailsSchema, required: false },
    status: { type: Boolean, required: true },
},
{
    timestamps: true
});

const Payment = mongoose.model<paymentModel>("Payment", paymentSchema);

export default Payment;
