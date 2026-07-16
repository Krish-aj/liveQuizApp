export interface TemplateQuestion{
    title:string;
    description:string;
    image?:string;
    answer:0|1|2|3;
    options:{id:number; title:string}[]
}

export interface QuizTemplate{
    _id:string;
    name:string;
    questions:TemplateQuestion[];
    createdAt:string;
    updatedAt:string;
}