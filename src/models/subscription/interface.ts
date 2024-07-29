import { Document, Types } from 'mongoose';

export interface ISubscription extends Document {
    restroId: Types.ObjectId;
    planId: Types.ObjectId;
    price: number;
    status: boolean;
}