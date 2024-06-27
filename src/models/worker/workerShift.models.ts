import mongoose, { Schema } from "mongoose";
import { workerShiftModel } from "./interface";


const workerShiftSchema = new mongoose.Schema({
    restroId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    displayName: { type: String, required: true }
},
    {
        timestamps: true
    }
);

const WorkerShift = mongoose.model<workerShiftModel>("WorkerShift", workerShiftSchema);

export default WorkerShift;