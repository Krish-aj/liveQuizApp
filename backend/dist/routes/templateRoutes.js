import { Router } from "express";
import { QuizTemplate } from "../models/QuizTemplate.js";
import { requireAdmin } from "../auth.js";
export const templateRoutes = Router();
templateRoutes.use(requireAdmin);
templateRoutes.get("/", async (req, res) => {
    const { admin } = req;
    const templates = await QuizTemplate.find({ ownerId: admin.adminId }).sort({ updatedAt: -1 });
    res.json(templates);
});
templateRoutes.post("/", async (req, res) => {
    const { admin } = req;
    const { name, questions } = req.body ?? {};
    if (!name || !Array.isArray(questions) || questions.length === 0) {
        res.status(400).json({ error: "name and at least one question are required" });
        return;
    }
    const template = await QuizTemplate.create({ ownerId: admin.adminId, name, questions });
    res.status(201).json(template);
});
templateRoutes.put("/:id", async (req, res) => {
    const { admin } = req;
    const { name, questions } = req.body ?? {};
    const template = await QuizTemplate.findOneAndUpdate({ _id: req.params.id, ownerId: admin.adminId }, { $set: { name, questions } }, { new: true });
    if (!template) {
        res.status(404).json({ error: "template not found" });
        return;
    }
    res.json(template);
});
templateRoutes.delete("/:id", async (req, res) => {
    const { admin } = req;
    const result = await QuizTemplate.deleteOne({ _id: req.params.id, ownerId: admin.adminId });
    if (result.deletedCount === 0) {
        res.status(404).json({ error: "template not found" });
        return;
    }
    res.status(204).send();
});
//# sourceMappingURL=templateRoutes.js.map