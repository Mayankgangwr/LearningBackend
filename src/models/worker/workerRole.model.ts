import mongoose, { Model, Schema } from "mongoose";
import { IWorkerRole } from "./interface";


const workerRoleSchema: Schema<IWorkerRole> = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true }
},
    {
        timestamps: true
    }
);

const WorkerRole: Model<IWorkerRole> = mongoose.model<IWorkerRole>("WorkerRole", workerRoleSchema);

export default WorkerRole;