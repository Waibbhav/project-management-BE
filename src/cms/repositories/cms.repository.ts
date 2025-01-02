import { InjectModel } from "@nestjs/mongoose";
import { AggregatePaginateModel, Model } from "mongoose";
import { Cms, CMSDocument } from "../schemas/cms.schema";
import { Injectable } from "@nestjs/common";
const mongoose = require('mongoose');
import * as _ from 'underscore';

@Injectable()
export class CmsRepository {
    constructor(
        @InjectModel(Cms.name) private cmsModel: Model<CMSDocument>,
        @InjectModel(Cms.name) private cmsModelPaginated: AggregatePaginateModel<CMSDocument>
    ) {}

    async getAllByField(params: any): Promise<any> {
        try {
            return await this.cmsModel.find(params).exec();
        } catch (error) {
            return error;
        }
    }

    async getAllByFieldWithProjection(params: any, projection: any): Promise<any> {
        try {
            return await this.cmsModel.find(params, projection).exec();
        } catch (error) {
            return error;
        }
    }

    async getByField(params: any): Promise<any> {
        try {
            return await this.cmsModel.findOne(params).exec();
        } catch (error) {
            return error;
        }
    }

    async getByFieldWithProjection(params: any, projection: any): Promise<any> {
        try {
            return await this.cmsModel.findOne(params, projection).exec();
        } catch (error) {
            return error;
        }
    }

    async getById(id: any): Promise<any> {
        try {
            return await this.cmsModel.findById(id).exec();
        } catch (error) {
            return error;
        }
    }

    async getCountByParam (params: any): Promise<any> {
        try {
            return await this.cmsModel.countDocuments(params);
        } catch (e) {
            return e;
        }
    }

    async save(body: any): Promise<any> {
        try {
            return await this.cmsModel.create(body);
        } catch (error) {
            return error;
        }
    }

    async updateById(data: any, id: any): Promise<any> {
        try {
            return await this.cmsModel.findByIdAndUpdate(id, data, {
                new: true
            });
        } catch (error) {
            return error;
        }
    }

    async getDistinctDocument(field:string, params:any) {
        try {
            let datas = await this.cmsModel.distinct(field, params);
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    }

    async getDistinctDocumentCount(field:string, params:any) {
        try {
            let datasCount = await this.cmsModel.distinct(field, params);
            if (!datasCount) {
                return 0;
            }
            return datasCount.length;
        } catch (e) {
            return e;
        }
    }

    async delete(id:any) {
        try {
            let dataDelete = await this.cmsModel.deleteOne({
                _id: mongoose.Types.ObjectId(id)
            }).exec();
            return dataDelete;
        } catch (e) {
            throw (e);
        }
    }

    async bulkDelete(params:any) {
        try {
            let deleted = await this.cmsModel.deleteMany(params);
            return true;
        } catch (e) {
            return e;
        }
    }

    async updateByField(data:any, param:any) {
        try {
            let datas = await this.cmsModel.updateOne(param, data, {
                new: true,
            });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    }

    async updateAllByParams(data:any, params:any) {
        try {
            let datas = await this.cmsModel.updateMany(params, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    }

    async getAll(req: any): Promise<any> {
        try {
            let conditions = {};
            let and_clauses = [];

            and_clauses.push({ "isDeleted": false });

            if (_.isObject(req.body.search) && _.has(req.body.search, 'value')) {
                and_clauses.push({
                    $or: [
                        { 'title': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'slug': { $regex: req.body.search.value.trim(), $options: 'i' } }
                    ]
                });
            }

            conditions['$and'] = and_clauses;

            let sortOperator = { "$sort": {} };
            if (_.has(req.body, 'order') && req.body.order.length) {
                for (let order of req.body.order) {
                    let sortField = req.body.columns[+order.column].data;
                    if (order.dir == 'desc') {
                        var sortOrder = -1;
                    } else if (order.dir == 'asc') {
                        var sortOrder = 1;
                    }
                    sortOperator["$sort"][sortField] = sortOrder;
                }
            } else {
                sortOperator["$sort"]['_id'] = -1;
            }

            let aggregate = this.cmsModel.aggregate([
                { $match: conditions },
                sortOperator
            ]);

            const options = { page: req.body.page, limit: req.body.length };
            const allDatas = await this.cmsModelPaginated.aggregatePaginate(aggregate, options);
            return allDatas;
        } catch (error) {
            return error;
        }
    }
}