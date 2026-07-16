export interface AdminDoc {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
}
export declare const Admin: import("mongoose").Model<AdminDoc, {}, {}, {}, import("mongoose").Document<unknown, {}, AdminDoc, {}, import("mongoose").DefaultSchemaOptions> & AdminDoc & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, AdminDoc>;
//# sourceMappingURL=Admin.d.ts.map