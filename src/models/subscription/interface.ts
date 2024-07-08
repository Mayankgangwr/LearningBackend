import mongoose, { Document } from 'mongoose';

export interface ISubscription extends Document {
    restroId: mongoose.Schema.Types.ObjectId;
    planId: mongoose.Schema.Types.ObjectId;
    price: number;
    status: boolean;
}