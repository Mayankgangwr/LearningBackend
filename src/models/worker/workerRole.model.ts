import mongoose, { Model, Schema } from "mongoose";
import { IWorkerRole } from "./interface";


const workerRoleSchema: Schema<IWorkerRole> = new mongoose.Schema<IWorkerRole>({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true },
    status: { type: Boolean, default: true }
},
    {
        timestamps: true
    }
);

const WorkerRole: Model<IWorkerRole> = mongoose.model<IWorkerRole>("WorkerRole", workerRoleSchema);

export default WorkerRole;