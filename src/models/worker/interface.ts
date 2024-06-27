import { Document } from 'mongoose';
export interface workerModel extends Document {
    roleId: string;
    shiftId: string;
    restroId: string;
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

export interface workerRoleModel extends Document {
    restroId: string;
    displayName: string;
}

export interface workerShiftModel extends Document {
    restroId: string;
    displayName: string;
}