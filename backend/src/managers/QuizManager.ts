import { type AllowedSubmissions, Quiz } from "../Quiz.js"
import type { TemplateQuestion } from "../models/QuizTemplate.js";
import  type { Problem } from "../Quiz.js";
let globalproblemId= 0;


export class QuizManager{
    private quizes: Quiz[]

    constructor(){
        this.quizes=[];
    }

    public start(roomId: string){
        
        const quiz= this.getQuiz(roomId)
        if(!quiz) return;
        quiz.start();
    }

    public addProblem(roomId: string, problem :{
        title: string;
        description: string;
        image?: string
        options:{
            id:number
            title:string
        }[];
        answer: AllowedSubmissions
    }){
        const quiz= this.getQuiz(roomId)
        if(!quiz) {
            return;
        }
        quiz.addProblem({
            ...problem,
            id: (globalproblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: []
        })
    }

    public next(roomId:string){
       const quiz= this.getQuiz(roomId)
        if(!quiz) {
            return;
        }
        quiz.next()
    }

    addUser(roomId: string , name: string){
        return this.getQuiz(roomId)?.addUser(name)
    }

    submit(roomId:string,userId: string,problemId: string, submission: AllowedSubmissions){
        this.getQuiz(roomId)?.submit(userId,problemId,submission)
    }

    getQuiz(roomId: string){
        return this.quizes.find(x => x.roomId === roomId) ?? null
    }

    getCurrentState(roomId: string){
    
        const quiz = this.quizes.find(x => x.roomId === roomId)
        if(!quiz){
            return null
        }
        return quiz.getCurrentState()
    }

    addQuiz(roomId:string,ownerId:string){
        if(this.getQuiz(roomId)) {return}
        
        const quiz= new Quiz(roomId,ownerId)
        this.quizes.push(quiz)
    }

    createRoomFromTemplate(roomId:string,questions:TemplateQuestion[],ownerId:string){
        if(this.getQuiz(roomId)) return null;

        const quiz=new Quiz(roomId,ownerId);
        const problems:Problem[]=questions.map(q=>({
            id:(globalproblemId++).toString(),
            title:q.title,
            description:q.description,
            ...(q.image?{image:q.image}:{}),
            answer:q.answer,
            options:q.options,
            startTime:new Date().getTime(),
            submissions:[],
        }));
        quiz.loadProblems(problems);
        this.quizes.push(quiz);
        quiz.start();
        return quiz;
    }
}