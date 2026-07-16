import { QuizManager } from "./QuizManager.js";
import {} from "../Quiz.js";
import { QuizTemplate } from "../models/QuizTemplate.js";
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
        socket.on("createQuiz", (data) => {
            if (!requireAdmin())
                return;
            this.quizManager.addQuiz(data.roomId);
            socket.join(data.roomId);
        });
        socket.on("createProblem", (data) => {
            if (!requireAdmin())
                return;
            this.quizManager.addProblem(data.roomId, data.problem);
        });
        socket.on("next", (data) => {
            if (!requireAdmin())
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
            const quiz = this.quizManager.createRoomFromTemplate(roomId, template.questions);
            if (!quiz) {
                socket.emit("error", { message: "room already exists" });
                return;
            }
            socket.join(roomId);
            socket.emit("roomCreated", { roomId });
        });
    }
}
//# sourceMappingURL=UserManager.js.map