/// <reference types="mongoose-aggregate-paginate-v2" />
import { AggregatePaginateModel, Model } from "mongoose";
import { ServiceDocument } from "../schemas/service.schema";
export declare class ServiceRepository {
    private ServiceModel;
    private serviceModelPaginated;
    constructor(ServiceModel: Model<ServiceDocument>, serviceModelPaginated: AggregatePaginateModel<ServiceDocument>);
    getAllByField(params: any): Promise<any>;
    getByField(params: any): Promise<any>;
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
    getAllServices(req: any): Promise<any>;
    getServiceDetails(params: any): Promise<any>;
    ServicePrimaryDetails(id: any): Promise<any>;
}
