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
    submit(roomId, userId, problemId, submission) {
        this.getQuiz(roomId)?.submit(userId, problemId, submission);
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
    addQuiz(roomId, ownerId) {
        if (this.getQuiz(roomId)) {
            return;
        }
        const quiz = new Quiz(roomId, ownerId);
        this.quizes.push(quiz);
    }
    createRoomFromTemplate(roomId, questions, ownerId) {
        if (this.getQuiz(roomId))
            return null;
        const quiz = new Quiz(roomId, ownerId);
        const problems = questions.map(q => ({
            id: (globalproblemId++).toString(),
            title: q.title,
            description: q.description,
            ...(q.image ? { image: q.image } : {}),
            answer: q.answer,
            options: q.options,
            startTime: new Date().getTime(),
            submissions: [],
        }));
        quiz.loadProblems(problems);
        this.quizes.push(quiz);
        quiz.start();
        return quiz;
    }
}
//# sourceMappingURL=QuizManager.js.map