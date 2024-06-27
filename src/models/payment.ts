const payment = {
    "id": "string",              // Primary Key
    "orderId": "string",         // Reference to Order
    "transactionId": "string",   // Unique identifier for the transaction
    "tax": "float",              // Applicable tax on the order
    "discount": "float",         // Discount applied to the order
    "payableAmount": "float",    // Final amount to be paid
    "paymentMethod": "string",   // Method used for payment (e.g., Credit Card, PayPal, UPI)
    "accountDetails": {          // Details of the account used for payment
      "accountName": "string",   // Name on the account
      "accountNumber": "string", // Account number
      "bankName": "string",      // Bank name
      "ifscCode": "string"       // IFSC code
    },
    "upiDetails": {              // Details for UPI payment
      "upiId": "string",         // UPI ID used for the payment
      "upiTransactionId": "string" // UPI transaction ID
    },
    "status": "boolean",         // Payment status (true for successful, false for failed)
    "createdAt": "date",         // Date and time when the payment was created
    "updatedAt": "date"          // Date and time when the payment was last updated
  };  