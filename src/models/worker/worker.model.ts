import mongoose, { Model, Schema } from "mongoose";
import { IWorker } from "./interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const workerSchema: Schema<IWorker> = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkerRole", required: true },
    shiftId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkerShift", required: true },
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    position: { type: String, required: true },
    avatar: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Number, required: true },
    aadharCard: { type: String, required: true },
    panCard: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    isLoggedIn: { type: Boolean, required: true },
},
    {
        timestamps: true
    }
);

workerSchema.pre<IWorker>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (err: any) {
        next(err);
    }
});

workerSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

workerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            displayName: this.displayName,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET || "D2DDDC74FD7D3F6FD138F36EDCF18",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
    )
}

workerSchema.methods.generateRefereshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET || "D2DDDC74FD7D3F6FD138F36EDCF18",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1d"
        }
    )
}

const Worker: Model<IWorker> = mongoose.model<IWorker>("Worker", workerSchema);

export default Worker;