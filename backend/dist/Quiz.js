import { IoManager } from "./managers/IoManager.js";
const PROBLEM_TIME_S = 20;
export class Quiz {
    roomId;
    hasStarted;
    problems;
    activeProblem;
    users;
    currentState;
    constructor(roomId) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started";
        console.log("room created");
        setInterval(() => {
            this.debug();
        }, 10000);
    }
    debug() {
        console.log("----debug----");
        console.log(this.roomId);
        console.log(JSON.stringify(this.problems));
        console.log(this.users);
        console.log(this.currentState);
        console.log(this.activeProblem);
    }
    addProblem(problem) {
        this.problems.push(problem);
        console.log(this.problems);
    }
    start() {
        this.hasStarted = true;
        const problem = this.problems[0];
        if (!problem)
            throw new Error("no problems found ");
        this.setActiveProblem(problem);
    }
    setActiveProblem(problem) {
        console.log("Set active problem");
        this.currentState = "question";
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        IoManager.getIo().to(this.roomId).emit("problem", {
            problem
        });
        //clear this if fn moves ahead
        setTimeout(() => {
            this.sendLeaderboard();
        }, PROBLEM_TIME_S * 1000);
    }
    sendLeaderboard() {
        console.log("send leaderboard");
        this.currentState = "leaderboard";
        const leaderboard = this.getLeaderboard();
        IoManager.getIo().to(this.roomId).emit("leaderboard", {
            leaderboard
        });
    }
    next() {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        if (problem) {
            this.setActiveProblem(problem);
        }
        else {
            this.activeProblem--;
            // IoManager.getIo().emit("QUIZ_END",{    
            //     problem
            // })
        }
    }
    getRandomString(length) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
        var charLength = chars.length;
        var result = '';
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result;
    }
    addUser(name) {
        const id = this.getRandomString(7);
        this.users.push({
            id,
            name,
            points: 0
        });
        return id;
    }
    submit(userId, roomId, problemId, submission) {
        console.log("userId");
        console.log(userId);
        const problem = this.problems.find(x => x.id == problemId);
        const user = this.users.find(x => x.id === userId);
        if (!problem || !user) {
            return;
        }
        const existingSubmission = problem.submissions.find(x => x.userId === userId);
        if (existingSubmission) {
            console.log("existing submission");
            return;
        }
        problem.submissions.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected: submission
        });
        user.points += (1000 - (500 * (new Date().getTime() - problem.startTime) / (PROBLEM_TIME_S * 1000)));
    }
    getLeaderboard() {
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1).slice(0, 20);
    }
    getCurrentState() {
        if (this.currentState == "not_started") {
            return {
                type: "not_started"
            };
        }
        if (this.currentState === "ended") {
            return {
                type: "ended",
                leaderboard: this.getLeaderboard()
            };
        }
        if (this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard()
            };
        }
        if (this.currentState === "question") {
            const problem = this.problems[this.activeProblem];
            return {
                type: "question",
                problem
            };
        }
    }
}
//# sourceMappingURL=Quiz.js.map