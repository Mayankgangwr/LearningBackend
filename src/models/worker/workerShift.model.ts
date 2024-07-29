import mongoose, { Model, Schema } from "mongoose";
import { IWorkerShift } from "./interface";


const workerShiftSchema: Schema<IWorkerShift> = new mongoose.Schema<IWorkerShift>({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true },
    status: { type: Boolean, default: true }
},
    {
        timestamps: true
    }
);

const WorkerShift: Model<IWorkerShift> = mongoose.model<IWorkerShift>("WorkerShift", workerShiftSchema);

export default WorkerShift;