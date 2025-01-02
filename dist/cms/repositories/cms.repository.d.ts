/// <reference types="mongoose-aggregate-paginate-v2" />
import { AggregatePaginateModel, Model } from "mongoose";
import { CMSDocument } from "../schemas/cms.schema";
export declare class CmsRepository {
    private cmsModel;
    private cmsModelPaginated;
    constructor(cmsModel: Model<CMSDocument>, cmsModelPaginated: AggregatePaginateModel<CMSDocument>);
    getAllByField(params: any): Promise<any>;
    getAllByFieldWithProjection(params: any, projection: any): Promise<any>;
    getByField(params: any): Promise<any>;
    getByFieldWithProjection(params: any, projection: any): Promise<any>;
    getById(id: any): Promise<any>;
    getCountByParam(params: any): Promise<any>;
    save(body: any): Promise<any>;
    updateById(data: any, id: any): Promise<any>;
    getDistinctDocument(field: string, params: any): Promise<any>;
    getDistinctDocumentCount(field: string, params: any): Promise<any>;
    delete(id: any): Promise<import("mongodb").DeleteResult>;
    bulkDelete(params: any): Promise<any>;
    updateByField(data: any, param: any): Promise<any>;
    updateAllByParams(data: any, params: any): Promise<any>;
    getAll(req: any): Promise<any>;
}
