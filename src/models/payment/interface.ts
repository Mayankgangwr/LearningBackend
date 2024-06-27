import { Document } from "mongoose";

interface AccountDetails {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
}

interface UPIDetails {
    upiId: string;
    upiTransactionId: string;
}

export interface paymentModel {
    orderId: string;               // Reference to Order
    transactionId: string;         // Unique identifier for the transaction
    tax: number;                   // Applicable tax on the order
    discount: number;              // Discount applied to the order
    payableAmount: number;         // Final amount to be paid
    paymentMethod: string;         // Method used for payment (e.g., Credit Card, PayPal, UPI)
    accountDetails?: AccountDetails; // Details of the account used for payment (optional)
    upiDetails?: UPIDetails;       // Details for UPI payment (optional)
    status: boolean;               // Payment status (true for successful, false for failed)
}
