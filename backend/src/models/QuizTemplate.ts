import {Schema,model,Types} from "mongoose"

export interface TemplateQuestion{
    title:string;
    description:string;
    image?:string;
    answer:0|1|2|3;
    options:{id:number; title:string}[];
}

export interface QuizTemplateDoc{
    ownerId:Types.ObjectId;
    name:string;
    questions:TemplateQuestion[];
}

const optionSchema= new Schema(
    {
        id:{type: Number,required:true},
        title:{type:String,required:true}
    },
    {_id:false}
);

const questionSchema=new Schema<TemplateQuestion>(
    {
        title:{type:String,required:true},
        description:{type:String,default:""},
        image:{type:String},
        answer:{type:Number,required:true,min:0,max:3},
        options:{type:[optionSchema],validate:(v:unknown[])=>v.length===4,},
    },
    {_id:false}
);


const templateSchema=new Schema<QuizTemplateDoc>(
    {
        ownerId:{type:Schema.Types.ObjectId, ref:"Admin", required:true},
        name:{type:String,required:true},
        questions:{type:[questionSchema],default:[]},
    },
    {timestamps:true}
);

export const QuizTemplate=model<QuizTemplateDoc>("QuizTemplate",templateSchema); 