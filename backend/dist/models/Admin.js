import { Schema, model } from "mongoose";
const adminSchema = new Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String },
}, { timestamps: true });
export const Admin = model("Admin", adminSchema);
//# sourceMappingURL=Admin.js.map