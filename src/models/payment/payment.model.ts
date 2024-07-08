import mongoose, { Model, Schema } from "mongoose";
import { IAccountDetails, IPayment, IUPIDetails } from "./interface";

const accountDetailsSchema: Schema<IAccountDetails> = new mongoose.Schema<IAccountDetails>({
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    ifscCode: { type: String, required: true },
});

const upiDetailsSchema: Schema<IUPIDetails> = new mongoose.Schema<IUPIDetails>({
    upiId: { type: String, required: true },
    upiTransactionId: { type: String, required: true },
});

const paymentSchema: Schema<IPayment> = new mongoose.Schema<IPayment>({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
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

const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
