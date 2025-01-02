/// <reference types="mongoose-aggregate-paginate-v2" />
import { AggregatePaginateModel, Model } from "mongoose";
import { UserDocument } from "../schemas/users.schema";
export declare class UserRepository {
    private userModel;
    private userModelPaginated;
    constructor(userModel: Model<UserDocument>, userModelPaginated: AggregatePaginateModel<UserDocument>);
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
    authentication(id: any): Promise<any>;
    fineOneWithRole(params: any): Promise<any>;
    getAllUsers(req: any): Promise<any>;
    getUserDetails(params: any): Promise<any>;
    userPrimaryDetails(id: any): Promise<any>;
}
