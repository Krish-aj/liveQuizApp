import { QuizManager } from "./QuizManager.js";
import {} from "../Quiz.js";
import { QuizTemplate } from "../models/QuizTemplate.js";
import { requireAdmin } from "../auth.js";
export class UserManager {
    quizManager;
    constructor() {
        this.quizManager = new QuizManager;
    }
    adduser(socket) {
        this.createHandlers(socket);
    }
    createHandlers(socket) {
        socket.on("join", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(data.roomId)
            });
            socket.join(data.roomId);
        });
        socket.on("submit", (data) => {
            const { roomId, userId, problemId, submission } = data ?? {};
            const isValidSubmission = [0, 1, 2, 3].includes(submission);
            if (!isValidSubmission) {
                console.error("invalid submission value: " + submission);
                return;
            }
            this.quizManager.submit(roomId, userId, problemId, submission);
        });
        // ---- Admin-only events ----
        const requireAdmin = () => {
            const adminId = socket.data.adminId;
            if (!adminId) {
                socket.emit("error", { message: "admin auth required" });
                return null;
            }
            return adminId;
        };
        const requireRoomOwner = (roomId) => {
            const adminId = requireAdmin();
            if (!adminId)
                return false;
            const quiz = this.quizManager.getQuiz(roomId);
            if (!quiz) {
                socket.emit("error", { message: "room not found" });
                return false;
            }
            if (quiz.ownerId !== adminId) {
                socket.emit("error", { message: "you dont own this room " });
                return false;
            }
            return true;
        };
        socket.on("createQuiz", (data) => {
            const adminId = requireAdmin();
            if (!adminId)
                return;
            this.quizManager.addQuiz(data.roomId, adminId);
            socket.join(data.roomId);
        });
        socket.on("createProblem", (data) => {
            if (!requireRoomOwner(data.roomId))
                return;
            this.quizManager.addProblem(data.roomId, data.problem);
        });
        socket.on("next", (data) => {
            if (!requireRoomOwner(data.roomId))
                return;
            this.quizManager.next(data.roomId);
        });
        socket.on("createRoomFromTemplate", async (data) => {
            const adminId = requireAdmin();
            if (!adminId)
                return;
            const { roomId, templateId } = data ?? {};
            if (!roomId || !templateId) {
                socket.emit("error", { message: "room and template id are required" });
                return;
            }
            const template = await QuizTemplate.findOne({ _id: templateId, ownerId: adminId });
            if (!template) {
                socket.emit("error", { message: "template not found" });
                return;
            }
            const quiz = this.quizManager.createRoomFromTemplate(roomId, template.questions, adminId);
            if (!quiz) {
                socket.emit("error", { message: "room already exists" });
                return;
            }
            socket.join(roomId);
            socket.emit("roomCreated", { roomId });
        });
        socket.on("deleteRoom", (data) => {
            const adminId = requireAdmin();
            if (!adminId)
                return;
            const { roomId } = data ?? {};
            if (!roomId) {
                socket.emit("error", { message: "room id is required" });
                return;
            }
            const deleted = this.quizManager.deleteRoom(roomId, adminId);
            if (!deleted) {
                socket.emit("error", { message: "could not delete room" });
                return;
            }
            socket.to(roomId).emit("roomDeleted", { roomId });
            socket.emit("roomDeleted", { roomId });
            socket.leave(roomId);
        });
    }
}
//# sourceMappingURL=UserManager.js.map