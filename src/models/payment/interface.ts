import mongoose, { Document } from "mongoose";

export interface IAccountDetails {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
}

 export interface IUPIDetails {
    upiId: mongoose.Schema.Types.ObjectId;
    upiTransactionId: string;
}

export interface IPayment {
    orderId: mongoose.Schema.Types.ObjectId;               // Reference to Order
    transactionId: mongoose.Schema.Types.ObjectId;         // Unique identifier for the transaction
    tax: number;                                           // Applicable tax on the order
    discount: number;                                      // Discount applied to the order
    payableAmount: number;                                 // Final amount to be paid
    paymentMethod: string;                                 // Method used for payment (e.g., Credit Card, PayPal, UPI)
    accountDetails?: IAccountDetails;                       // Details of the account used for payment (optional)
    upiDetails?: IUPIDetails;                               // Details for UPI payment (optional)
    status: boolean;                                       // Payment status (true for successful, false for failed)
}
