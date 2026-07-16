import mongoose from "mongoose";
export async function connectDb() {
    const uri = process.env.MONGO_URI;
    if (!uri)
        throw new Error("mongo db uri not set");
    await mongoose
        .connect(uri)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log("mongo error", err));
}
//# sourceMappingURL=db.js.map