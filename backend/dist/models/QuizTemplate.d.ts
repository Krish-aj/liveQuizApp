import { Types } from "mongoose";
export interface TemplateQuestion {
    title: string;
    description: string;
    image?: string;
    answer: 0 | 1 | 2 | 3;
    options: {
        id: number;
        title: string;
    }[];
}
export interface QuizTemplateDoc {
    ownerId: Types.ObjectId;
    name: string;
    questions: TemplateQuestion[];
}
export declare const QuizTemplate: import("mongoose").Model<QuizTemplateDoc, {}, {}, {}, import("mongoose").Document<unknown, {}, QuizTemplateDoc, {}, import("mongoose").DefaultSchemaOptions> & QuizTemplateDoc & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, QuizTemplateDoc>;
//# sourceMappingURL=QuizTemplate.d.ts.map