import { Document } from 'mongoose';

export enum EPlanDuration {
  ThreeMonth,
  SixMonth,
  OneYear
}

export interface IPlan extends Document {
  displayName: string;
  duration: EPlanDuration;
  mrp: number;
  price: number;
  status: boolean;
}