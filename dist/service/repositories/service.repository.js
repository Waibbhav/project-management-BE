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
exports.ServiceRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const service_schema_1 = require("../schemas/service.schema");
const common_1 = require("@nestjs/common");
const mongoose = require("mongoose");
const _ = require("underscore");
let ServiceRepository = class ServiceRepository {
    constructor(ServiceModel, serviceModelPaginated) {
        this.ServiceModel = ServiceModel;
        this.serviceModelPaginated = serviceModelPaginated;
    }
    async getAllByField(params) {
        try {
            return await this.ServiceModel.find(params).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getByField(params) {
        try {
            return await this.ServiceModel.findOne(params).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getById(id) {
        try {
            return await this.ServiceModel.findById(id).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getCountByParam(params) {
        try {
            return await this.ServiceModel.countDocuments(params);
        }
        catch (e) {
            return e;
        }
    }
    async save(body) {
        try {
            return await this.ServiceModel.create(body);
        }
        catch (error) {
            return error;
        }
    }
    async updateById(data, id) {
        try {
            return await this.ServiceModel.findByIdAndUpdate(id, data, {
                new: true,
            });
        }
        catch (error) {
            return error;
        }
    }
    async getDistinctDocument(field, params) {
        try {
            let datas = await this.ServiceModel.distinct(field, params);
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
            let datasCount = await this.ServiceModel.distinct(field, params);
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
            let dataDelete = await this.ServiceModel
                .deleteOne({
                _id: mongoose.Types.ObjectId(id),
            })
                .exec();
            return dataDelete;
        }
        catch (e) {
            throw e;
        }
    }
    async bulkDelete(params) {
        try {
            let deleted = await this.ServiceModel.deleteMany(params);
            return true;
        }
        catch (e) {
            return e;
        }
    }
    async updateByField(data, param) {
        try {
            let datas = await this.ServiceModel.updateOne(param, data, {
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
            let datas = await this.ServiceModel.updateMany(params, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        }
        catch (e) {
            return e;
        }
    }
    async getAllServices(req) {
        try {
            let conditions = {};
            let and_clauses = [];
            and_clauses.push({ isDeleted: false });
            and_clauses.push({ "Service_role.role": req.body.role });
            if (_.isObject(req.body.search) && _.has(req.body.search, "value")) {
                and_clauses.push({
                    $or: [
                        {
                            fullName: { $regex: req.body.search.value.trim(), $options: "i" },
                        },
                        {
                            email: {
                                $regex: "^" + req.body.search.value.trim(),
                                $options: "i",
                            },
                        },
                    ],
                });
            }
            if (req.body.columns && req.body.columns.length) {
                let statusFilter = _.findWhere(req.body.columns, { data: "status" });
                if (statusFilter && statusFilter.search && statusFilter.search.value) {
                    and_clauses.push({
                        status: statusFilter.search.value,
                    });
                }
            }
            conditions["$and"] = and_clauses;
            let sortOperator = { $sort: {} };
            if (_.has(req.body, "order") && req.body.order.length) {
                for (let order of req.body.order) {
                    let sortField = req.body.columns[+order.column].data;
                    if (order.dir == "desc") {
                        var sortOrder = -1;
                    }
                    else if (order.dir == "asc") {
                        var sortOrder = 1;
                    }
                    sortOperator["$sort"][sortField] = sortOrder;
                }
            }
            else {
                sortOperator["$sort"]["_id"] = -1;
            }
            let aggregate = this.ServiceModel.aggregate([
                {
                    $lookup: {
                        from: "roles",
                        let: { role: "$role" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$role"] },
                                            { $eq: ["$isDeleted", false] },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: "$_id",
                                    role: "$role",
                                    roleDisplayName: "$roleDisplayName",
                                },
                            },
                        ],
                        as: "Service_role",
                    },
                },
                { $unwind: "$Service_role" },
                {
                    $group: {
                        _id: "$_id",
                        fullName: { $first: "$fullName" },
                        email: { $first: "$email" },
                        countryCode: { $first: "$countryCode" },
                        phone: { $first: "$phone" },
                        signupCompleted: { $first: "$signupCompleted" },
                        isEmailVerified: { $first: "$isEmailVerified" },
                        isPhoneVerified: { $first: "$isPhoneVerified" },
                        isDeleted: { $first: "$isDeleted" },
                        status: { $first: "$status" },
                        Service_role: { $first: "$Service_role" },
                        profile_image: { $first: "$profile_image" },
                        createdAt: { $first: "$createdAt" },
                    },
                },
                { $match: conditions },
                sortOperator,
            ]);
            const options = { page: req.body.page, limit: req.body.length };
            const allServices = await this.serviceModelPaginated.aggregatePaginate(aggregate, options);
            return allServices;
        }
        catch (error) {
            return error;
        }
    }
    async getServiceDetails(params) {
        try {
            let aggregate = await this.ServiceModel.aggregate([
                { $match: params },
                {
                    $lookup: {
                        from: "roles",
                        let: { role: "$role" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ["$_id", "$$role"] }],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: "$_id",
                                    role: "$role",
                                    roleDisplayName: "$roleDisplayName",
                                },
                            },
                        ],
                        as: "role",
                    },
                },
                { $unwind: "$role" },
                {
                    $lookup: {
                        from: "business_types",
                        localField: "business_type",
                        foreignField: "_id",
                        as: "business_type_data",
                    },
                },
                {
                    $project: {
                        password: 0,
                        stripeCustomerId: 0,
                        isDeleted: 0,
                        otp: 0,
                        updatedAt: 0,
                        verificationDocs: 0,
                        otpType: 0,
                        appleId: 0,
                        googleId: 0,
                    },
                },
            ]);
            if (!aggregate)
                return null;
            return aggregate;
        }
        catch (e) {
            return e;
        }
    }
    async ServicePrimaryDetails(id) {
        try {
            let aggregate = await this.ServiceModel.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "business_types",
                        localField: "business_type",
                        foreignField: "_id",
                        as: "business_type_data",
                    },
                },
                {
                    $unwind: {
                        path: "$business_type_data",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        fullName: { $first: "$fullName" },
                        email: { $first: "$email" },
                        countryCode: { $first: "$countryCode" },
                        phone: { $first: "$phone" },
                        business_type: { $first: "$business_type_data.title" },
                        signupCompleted: { $first: "$signupCompleted" },
                        isEmailVerified: { $first: "$isEmailVerified" },
                        isPhoneVerified: { $first: "$isPhoneVerified" },
                        isDeleted: { $first: "$isDeleted" },
                        status: { $first: "$status" },
                        Service_role: { $first: "$Service_role" },
                        profile_image: { $first: "$profile_image" },
                        createdAt: { $first: "$createdAt" },
                    },
                },
            ]);
            if (!aggregate)
                return null;
            return aggregate;
        }
        catch (e) {
            return e;
        }
    }
};
ServiceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(service_schema_1.Service.name)),
    __param(1, (0, mongoose_1.InjectModel)(service_schema_1.Service.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], ServiceRepository);
exports.ServiceRepository = ServiceRepository;
//# sourceMappingURL=service.repository.js.map