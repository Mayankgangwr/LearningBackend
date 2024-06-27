import mongoose, { Schema } from "mongoose";
import { workerRoleModel } from "./interface";


const workerRoleSchema = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true }
},
    {
        timestamps: true
    }
);

const WorkerRole = mongoose.model<workerRoleModel>("WorkerRole", workerRoleSchema);

export default WorkerRole;