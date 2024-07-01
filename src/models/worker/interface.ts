import mongoose, { Document } from 'mongoose';
export interface IWorker extends Document {
    roleId: mongoose.Schema.Types.ObjectId;
    shiftId: mongoose.Schema.Types.ObjectId;
    restroId: mongoose.Schema.Types.ObjectId;
    displayName: string;
    username: string;
    password: string;
    position: string;
    imageUrl: string;
    phoneNumber: string;
    dob: number;
    aadharCard: string;
    panCard: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string
    isLoggedIn: boolean;
}

export interface IWorkerRole extends Document {
    restroId: mongoose.Schema.Types.ObjectId;
    displayName: string;
}

export interface IWorkerShift extends Document {
    restroId: mongoose.Schema.Types.ObjectId;
    displayName: string;
}