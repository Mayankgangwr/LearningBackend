import mongoose, { Model, Schema } from "mongoose";
import { ISuperAdmin } from "./interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const superAdminSchema: Schema<ISuperAdmin> = new mongoose.Schema<ISuperAdmin>(
    {
        displayName: { type: String, required: true, default: "SuperAdmin" },
        username: { type: String, required: true },
        password: { type: String, required: true },
        refreshToken: { type: String, default: undefined },
        status: { type: Boolean, default: true }
    }, {
    timestamps: true
}
);

superAdminSchema.pre<ISuperAdmin>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (err: any) {
        next(err);
    }
});

superAdminSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

superAdminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            displayName: this.displayName,
            username: this.username,
        },
        process.env.SUPERADMIN_ACCESS_TOKEN_SECRET || "D2DCDC74FD7D3F6FD138F36EDCF18",
        {
            expiresIn: process.env.SUPERADMIN_ACCESS_TOKEN_EXPIRY || "1d"
        }
    )
}


superAdminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.SUPERADMIN_REFRESH_TOKEN_SECRET || "95958DF847436FBCAFA92FA1EF1DD",
        {
            expiresIn: process.env.SUPERADMIN_REFRESH_TOKEN_EXPIRY || "2d"
        }
    )
}

const SuperAdmin: Model<ISuperAdmin> = mongoose.model<ISuperAdmin>("SuperAdmin", superAdminSchema);

export default SuperAdmin;
