"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cms_schema_1 = require("../schemas/cms.schema");
const common_1 = require("@nestjs/common");
const mongoose = require('mongoose');
const _ = require("underscore");
let CmsRepository = class CmsRepository {
    constructor(cmsModel, cmsModelPaginated) {
        this.cmsModel = cmsModel;
        this.cmsModelPaginated = cmsModelPaginated;
    }
    async getAllByField(params) {
        try {
            return await this.cmsModel.find(params).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getAllByFieldWithProjection(params, projection) {
        try {
            return await this.cmsModel.find(params, projection).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getByField(params) {
        try {
            return await this.cmsModel.findOne(params).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getByFieldWithProjection(params, projection) {
        try {
            return await this.cmsModel.findOne(params, projection).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getById(id) {
        try {
            return await this.cmsModel.findById(id).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getCountByParam(params) {
        try {
            return await this.cmsModel.countDocuments(params);
        }
        catch (e) {
            return e;
        }
    }
    async save(body) {
        try {
            return await this.cmsModel.create(body);
        }
        catch (error) {
            return error;
        }
    }
    async updateById(data, id) {
        try {
            return await this.cmsModel.findByIdAndUpdate(id, data, {
                new: true
            });
        }
        catch (error) {
            return error;
        }
    }
    async getDistinctDocument(field, params) {
        try {
            let datas = await this.cmsModel.distinct(field, params);
            if (!datas) {
                return null;
            }
            return datas;
        }
        catch (e) {
            return e;
        }
    }
    async getDistinctDocumentCount(field, params) {
        try {
            let datasCount = await this.cmsModel.distinct(field, params);
            if (!datasCount) {
                return 0;
            }
            return datasCount.length;
        }
        catch (e) {
            return e;
        }
    }
    async delete(id) {
        try {
            let dataDelete = await this.cmsModel.deleteOne({
                _id: mongoose.Types.ObjectId(id)
            }).exec();
            return dataDelete;
        }
        catch (e) {
            throw (e);
        }
    }
    async bulkDelete(params) {
        try {
            let deleted = await this.cmsModel.deleteMany(params);
            return true;
        }
        catch (e) {
            return e;
        }
    }
    async updateByField(data, param) {
        try {
            let datas = await this.cmsModel.updateOne(param, data, {
                new: true,
            });
            if (!datas) {
                return null;
            }
            return datas;
        }
        catch (e) {
            return e;
        }
    }
    async updateAllByParams(data, params) {
        try {
            let datas = await this.cmsModel.updateMany(params, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        }
        catch (e) {
            return e;
        }
    }
    async getAll(req) {
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
                    }
                    else if (order.dir == 'asc') {
                        var sortOrder = 1;
                    }
                    sortOperator["$sort"][sortField] = sortOrder;
                }
            }
            else {
                sortOperator["$sort"]['_id'] = -1;
            }
            let aggregate = this.cmsModel.aggregate([
                { $match: conditions },
                sortOperator
            ]);
            const options = { page: req.body.page, limit: req.body.length };
            const allDatas = await this.cmsModelPaginated.aggregatePaginate(aggregate, options);
            return allDatas;
        }
        catch (error) {
            return error;
        }
    }
};
CmsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cms_schema_1.Cms.name)),
    __param(1, (0, mongoose_1.InjectModel)(cms_schema_1.Cms.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], CmsRepository);
exports.CmsRepository = CmsRepository;
//# sourceMappingURL=cms.repository.js.map