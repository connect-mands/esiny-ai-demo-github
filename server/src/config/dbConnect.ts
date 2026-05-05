import mongoose from "mongoose";
import { MONGO_URI } from "./server.config.js";

const dbConnect = async() => {
    try {
        await mongoose.connect(MONGO_URI as string)
        console.log("Mongodb connected successfully ")
    } catch (error) {
        console.log("Error in db connecting",error)
        process.exit(1);
    }
}

export default dbConnect