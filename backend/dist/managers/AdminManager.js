import { QuizManager } from "./QuizManager.js";
export class AdminManager {
    users;
    quizManager;
    constructor() {
        this.users = [];
        this.quizManager = new QuizManager;
    }
    adduser(roomId, socket) {
        this.users.push({
            socket, roomId
        });
        this.createHandlers(roomId, socket);
    }
    createHandlers(roomId, socket) {
        socket.on("join", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("userId", {
                userId,
                state: this.quizManager.getCurrentState(roomId)
            });
        });
        socket.on("submit", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.submission;
            if (submission != 0 || submission != 1 || submission != 2 || submission != 3) {
                console.error("issue while getting input" + submission);
                return;
            }
            this.quizManager.submit(userId, roomId, problemId, submission);
        });
    }
}
//# sourceMappingURL=AdminManager.js.map