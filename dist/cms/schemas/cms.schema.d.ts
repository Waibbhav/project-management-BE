import * as mongoose from 'mongoose';
export type CMSDocument = mongoose.HydratedDocument<Cms>;
export declare class Cms {
    title: string;
    slug: string;
    content: string;
    status: string;
    isDeleted: boolean;
}
export declare const CmsSchema: mongoose.Schema<Cms, mongoose.Model<Cms, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Cms>;
