import { Schema,model } from "mongoose";

export interface AdminDoc{
    googleId: string;
    email:string;
    name:string;
    picture?:string;
}

const adminSchema= new Schema<AdminDoc>(
    {
        googleId:{type:String,required:true,unique:true},
        email: {type:String, required:true},
        name: {type:String, required:true},
        picture: {type: String},
    },
    { timestamps:true}
);

export const Admin=model<AdminDoc>("Admin",adminSchema)