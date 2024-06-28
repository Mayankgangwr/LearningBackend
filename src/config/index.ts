import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.LOCAL_MONGODB_URI || "mongodb://localhost:27017/"}/${DB_NAME}`);
        console.log(`\n MONGODB connection !! DB HOST: ${connectionInstance.connection.host}:${connectionInstance.connection.port}`)
    } catch (error: any) {
        console.error("MONGODB connection error ", error);
        process.exit(1)
    }
};
export default connectDB;