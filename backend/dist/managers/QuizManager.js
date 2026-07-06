import { Quiz } from "../Quiz.js";
let globalproblemId = 0;
export class QuizManager {
    quizes;
    constructor() {
        this.quizes = [];
    }
    start(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz)
            return;
        quiz.start();
    }
    addProblem(roomId, problem) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem({
            ...problem,
            id: (globalproblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: []
        });
    }
    next(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.next();
    }
    addUser(roomId, name) {
        return this.getQuiz(roomId)?.addUser(name);
    }
    submit(userId, roomId, problemId, submission) {
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
    }
    getQuiz(roomId) {
        return this.quizes.find(x => x.roomId === roomId) ?? null;
    }
    getCurrentState(roomId) {
        const quiz = this.quizes.find(x => x.roomId === roomId);
        if (!quiz) {
            return null;
        }
        return quiz.getCurrentState();
    }
    addQuiz(roomId) {
        if (this.getQuiz(roomId)) {
            return;
        }
        const quiz = new Quiz(roomId);
        this.quizes.push(quiz);
    }
}
//# sourceMappingURL=QuizManager.js.map