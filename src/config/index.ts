import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
    try {
        const baseUri = process.env.LOCAL_MONGODB_URI || "mongodb://localhost:27017";
        const connectionString = `${baseUri.replace(/\/$/, '')}/${DB_NAME}`;
        
        const connectionInstance = await mongoose.connect(connectionString);
        console.log(`\n MONGODB connection !! DB HOST: ${connectionInstance.connection.host}:${connectionInstance.connection.port}`);
    } catch (error: any) {
        console.error("MONGODB connection error ", error);
        process.exit(1);
    }
};

export default connectDB;
