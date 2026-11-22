import mongoose from "mongoose";

export async function connectDb(){
    const uri=process.env.MONGO_URI;
    if(!uri) throw new Error("mongo db uri not set");
    // No .catch here: a failed connection should stop startup so Render restarts the service
    await mongoose.connect(uri);
    console.log("MongoDB connected");
}