import { Document } from 'mongoose';
export interface restaurantModel extends Document {
    displayName: string;
    username: string;
    password: string;
    imageUrl: string;
    managerName: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
  pincode: string
    status: boolean;
}