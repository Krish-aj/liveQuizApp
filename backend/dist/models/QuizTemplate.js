import { Schema, model, Types } from "mongoose";
const optionSchema = new Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true }
}, { _id: false });
const questionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String },
    answer: { type: Number, required: true, min: 0, max: 3 },
    options: { type: [optionSchema], validate: (v) => v.length === 4, },
}, { _id: false });
const templateSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    name: { type: String, required: true },
    questions: { type: [questionSchema], default: [] },
}, { timestamps: true });
export const QuizTemplate = model("QuizTemplate", templateSchema);
//# sourceMappingURL=QuizTemplate.js.map