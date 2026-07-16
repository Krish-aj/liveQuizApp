export type AllowedSubmissions = 0 | 1 | 2 | 3;
export interface User {
    name: string;
    id: string;
    points: number;
}
export interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmissions;
}
export interface Problem {
    id: string;
    title: string;
    description: string;
    image?: string;
    startTime: number;
    answer: AllowedSubmissions;
    options: {
        id: number;
        title: string;
    }[];
    submissions: Submission[];
}
export declare class Quiz {
    roomId: string;
    ownerId: string;
    private hasStarted;
    private problems;
    private activeProblem;
    private users;
    private currentState;
    constructor(roomId: string, ownerId: string);
    debug(): void;
    addProblem(problem: Problem): void;
    loadProblems(problems: Problem[]): void;
    start(): void;
    setActiveProblem(problem: Problem): void;
    sendLeaderboard(): void;
    next(): void;
    getRandomString(length: number): string;
    addUser(name: string): string;
    submit(userId: string, problemId: string, submission: AllowedSubmissions): void;
    getLeaderboard(): User[];
    getCurrentState(): {
        type: string;
        leaderboard?: never;
        problem?: never;
    } | {
        type: string;
        leaderboard: User[];
        problem?: never;
    } | {
        type: string;
        problem: Problem | undefined;
        leaderboard?: never;
    } | undefined;
}
//# sourceMappingURL=Quiz.d.ts.map