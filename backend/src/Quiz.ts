import { IoManager } from "./managers/IoManager.js";

export type AllowedSubmissions = 0 | 1 | 2 | 3
const PROBLEM_TIME_S = 5

export interface User {
    name: string
    id: string
    points: number
}

export interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmissions
}

export interface Problem {
    id: string
    title: string;
    description: string;
    image?: string
    startTime: number
    answer: AllowedSubmissions
    options: {
        id: number
        title: string
    }[]
    submissions: Submission[]
}

export class Quiz {
    public roomId: string
    public ownerId: string;
    private hasStarted: boolean
    private problems: Problem[]
    private activeProblem: number
    private users: User[]
    private currentState: "leaderboard" | "question" | "not_started" | "ended"
    private leaderboardTimer: ReturnType<typeof setTimeout> | null = null

    constructor(roomId: string, ownerId: string) {
        this.roomId = roomId;
        this.ownerId = ownerId;
        this.hasStarted = false;
        this.problems = []
        this.activeProblem = 0
        this.users = []
        this.currentState = "not_started"
        console.log("room created")
        setInterval(() => {
            this.debug();
        }, 10000);
    }

    debug() {
        console.log("----debug----")
        console.log(this.roomId)
        console.log(JSON.stringify(this.problems))
        console.log(this.users)
        console.log(this.currentState)
        console.log(this.activeProblem)

    }


    addProblem(problem: Problem) {
        this.problems.push(problem)
        console.log(this.problems)
    }

    loadProblems(problems: Problem[]) {
        this.problems = problems
    }

    start() {
        this.hasStarted = true;
        this.activeProblem = 0;
        const problem = this.problems[0]
        if (!problem) throw new Error("no problems found ")
        this.setActiveProblem(problem);

    }


    setActiveProblem(problem: Problem) {
        console.log("Set active problem")
        this.currentState = "question"
        problem.startTime = new Date().getTime()
        problem.submissions = []
        IoManager.getIo().to(this.roomId).emit("problem", {
            problem,
            questionIndex: this.activeProblem + 1,
            totalQuestions: this.problems.length,
        })
        // Auto-send leaderboard after timer expires
        if (this.leaderboardTimer) clearTimeout(this.leaderboardTimer)
        this.leaderboardTimer = setTimeout(() => {
            this.sendLeaderboard()
        }, PROBLEM_TIME_S * 1000)
    }

    sendLeaderboard() {
        console.log("send leaderboard")
        const leaderboard = this.getLeaderboard();
        const isLast = this.activeProblem >= this.problems.length - 1;
        if (isLast) {
            this.currentState = "leaderboard"
            IoManager.getIo().to(this.roomId).emit("leaderboard", { leaderboard })
        }
    }

    next() {
        // Clear any pending leaderboard timer from previous question
        if (this.leaderboardTimer) {
            clearTimeout(this.leaderboardTimer)
            this.leaderboardTimer = null
        }
        if (!this.hasStarted) {
            this.start();
            return;
        }
        this.activeProblem++;
        const problem = this.problems[this.activeProblem]

        if (problem) {
            this.setActiveProblem(problem);
        } else {
            this.activeProblem--;
            this.currentState = "leaderboard";
            IoManager.getIo().to(this.roomId).emit("leaderboard", {
                leaderboard: this.getLeaderboard()
            })

        }
    }


    getRandomString(length: number) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()'
        var charLength = chars.length;
        var result = ''
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result
    }


    addUser(name: string) {
        const id = this.getRandomString(7)
        this.users.push({
            id,
            name,
            points: 0
        })
        return id;
    }


    submit(userId: string, problemId: string, submission: AllowedSubmissions) {

        console.log("userId");
        console.log(userId);

        const problem = this.problems.find(x => x.id == problemId)
        const user = this.users.find(x => x.id === userId)

        if (!problem || !user) {
            return
        }
        const existingSubmission = problem.submissions.find(x => x.userId === userId)
        if (existingSubmission) {
            console.log("existing submission")
            return;
        }
        const isCorrect = problem.answer === submission
        problem.submissions.push({
            problemId,
            userId,
            isCorrect,
            optionSelected: submission
        })
        if (isCorrect) {
            const e_time = new Date().getTime() - problem.startTime
            const timeBonus = Math.max(0, 1000 - (500 * e_time) / (PROBLEM_TIME_S * 1000))
            user.points += timeBonus;
        }
    }


    getLeaderboard() {
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1).slice(0, 20)
    }

    getCurrentState() {
        if (this.currentState == "not_started") {
            return {
                type: "not_started"
            }
        }
        if (this.currentState === "ended") {
            return {
                type: "ended",
                //leaderboard: this.getLeaderboard()
            }
        }
        if (this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard()
            }
        }
        if (this.currentState === "question") {
            const problem = this.problems[this.activeProblem]
            return {
                type: "question",
                problem,
                questionIndex: this.activeProblem + 1,
                totalQuestions: this.problems.length,
            }
        }
    }
}
