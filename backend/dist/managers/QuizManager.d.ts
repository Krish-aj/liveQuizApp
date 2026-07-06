import { type AllowedSubmissions, Quiz } from "../Quiz.js";
export declare class QuizManager {
    private quizes;
    constructor();
    start(roomId: string): void;
    addProblem(roomId: string, problem: {
        title: string;
        description: string;
        image?: string;
        options: {
            id: number;
            title: string;
        }[];
        answer: AllowedSubmissions;
    }): void;
    next(roomId: string): void;
    addUser(roomId: string, name: string): string | undefined;
    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmissions): void;
    getQuiz(roomId: string): Quiz | null;
    getCurrentState(roomId: string): {
        type: string;
        leaderboard?: never;
        problem?: never;
    } | {
        type: string;
        leaderboard: import("../Quiz.js").User[];
        problem?: never;
    } | {
        type: string;
        problem: import("../Quiz.js").Problem | undefined;
        leaderboard?: never;
    } | null | undefined;
    addQuiz(roomId: string): void;
}
//# sourceMappingURL=QuizManager.d.ts.map