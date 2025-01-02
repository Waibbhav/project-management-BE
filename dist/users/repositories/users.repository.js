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
exports.UserRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_schema_1 = require("../schemas/users.schema");
const bcrypt = require("bcrypt-nodejs");
const common_1 = require("@nestjs/common");
const mongoose = require('mongoose');
const _ = require("underscore");
let UserRepository = class UserRepository {
    constructor(userModel, userModelPaginated) {
        this.userModel = userModel;
        this.userModelPaginated = userModelPaginated;
    }
    async getAllByField(params) {
        try {
            return await this.userModel.find(params).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getByField(params) {
        try {
            return await this.userModel.findOne(params).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getById(id) {
        try {
            return await this.userModel.findById(id).exec();
        }
        catch (error) {
            return error;
        }
    }
    async getCountByParam(params) {
        try {
            return await this.userModel.countDocuments(params);
        }
        catch (e) {
            return e;
        }
    }
    async save(body) {
        try {
            return await this.userModel.create(body);
        }
        catch (error) {
            return error;
        }
    }
    async updateById(data, id) {
        try {
            return await this.userModel.findByIdAndUpdate(id, data, {
                new: true
            });
        }
        catch (error) {
            return error;
        }
    }
    async getDistinctDocument(field, params) {
        try {
            let datas = await this.userModel.distinct(field, params);
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
            let datasCount = await this.userModel.distinct(field, params);
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
            let dataDelete = await this.userModel.deleteOne({
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
            let deleted = await this.userModel.deleteMany(params);
            return true;
        }
        catch (e) {
            return e;
        }
    }
    async updateByField(data, param) {
        try {
            let datas = await this.userModel.updateOne(param, data, {
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
            let datas = await this.userModel.updateMany(params, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        }
        catch (e) {
            return e;
        }
    }
    async authentication(id) {
        try {
            let user = await this.userModel.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(id), isDeleted: false } },
                {
                    $lookup: {
                        from: 'roles',
                        let: { role: '$role' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$role"] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    isDeleted: 0
                                }
                            }
                        ],
                        as: 'role'
                    }
                },
                { $unwind: "$role" }
            ]);
            if (user && user.length)
                return user[0];
            return null;
        }
        catch (error) {
            return error;
        }
    }
    async fineOneWithRole(params) {
        try {
            let user = await this.userModel.findOne({
                email: params.email,
                role: { $in: params.roles },
                isDeleted: false,
                status: "Active"
            }).populate('role').exec();
            if (!user) {
                throw {
                    "status": 500,
                    data: null,
                    "message": 'Authentication failed. User not found.'
                };
            }
            const validPassword = function (password, checkPassword) {
                return bcrypt.compareSync(password, checkPassword);
            };
            if (!validPassword(params.password, user.password)) {
                throw {
                    "status": 500,
                    data: null,
                    "message": 'Authentication failed. Wrong password.'
                };
            }
            else {
                throw {
                    "status": 200,
                    data: user,
                    "message": ""
                };
            }
        }
        catch (e) {
            return e;
        }
    }
    async getAllUsers(req) {
        try {
            let conditions = {};
            let and_clauses = [];
            and_clauses.push({ "isDeleted": false });
            and_clauses.push({ "user_role.role": req.body.role });
            if (_.isObject(req.body.search) && _.has(req.body.search, 'value')) {
                and_clauses.push({
                    $or: [
                        { 'fullName': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'email': { $regex: '^' + req.body.search.value.trim(), $options: 'i' } },
                    ]
                });
            }
            if (req.body.columns && req.body.columns.length) {
                let statusFilter = _.findWhere(req.body.columns, { data: 'status' });
                if (statusFilter && statusFilter.search && statusFilter.search.value) {
                    and_clauses.push({
                        "status": statusFilter.search.value
                    });
                }
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
            let aggregate = this.userModel.aggregate([
                {
                    $lookup: {
                        "from": "roles",
                        "let": { role: "$role" },
                        "pipeline": [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$role"] },
                                            { $eq: ["$isDeleted", false] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: "$_id",
                                    role: "$role",
                                    roleDisplayName: "$roleDisplayName"
                                }
                            }
                        ],
                        "as": "user_role"
                    }
                },
                { "$unwind": "$user_role" },
                {
                    $group: {
                        '_id': '$_id',
                        'fullName': { $first: '$fullName' },
                        'email': { $first: '$email' },
                        'countryCode': { $first: '$countryCode' },
                        'phone': { $first: '$phone' },
                        'signupCompleted': { $first: '$signupCompleted' },
                        'isEmailVerified': { $first: '$isEmailVerified' },
                        'isPhoneVerified': { $first: '$isPhoneVerified' },
                        'isDeleted': { $first: '$isDeleted' },
                        'status': { $first: '$status' },
                        'user_role': { $first: '$user_role' },
                        'profile_image': { $first: '$profile_image' },
                        'createdAt': { $first: '$createdAt' }
                    }
                },
                { $match: conditions },
                sortOperator
            ]);
            const options = { page: req.body.page, limit: req.body.length };
            const allUsers = await this.userModelPaginated.aggregatePaginate(aggregate, options);
            return allUsers;
        }
        catch (error) {
            return error;
        }
    }
    async getUserDetails(params) {
        try {
            let aggregate = await this.userModel.aggregate([
                { $match: params },
                {
                    $lookup: {
                        "from": "roles",
                        let: { role: "$role" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$role"] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: "$_id",
                                    role: "$role",
                                    roleDisplayName: "$roleDisplayName"
                                }
                            }
                        ],
                        "as": "role"
                    }
                },
                { "$unwind": "$role" },
                {
                    $lookup: {
                        from: "business_types",
                        localField: "business_type",
                        foreignField: "_id",
                        as: "business_type_data"
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
                    }
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
    async userPrimaryDetails(id) {
        try {
            let aggregate = await this.userModel.aggregate([
                { $match: { '_id': mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "business_types",
                        localField: "business_type",
                        foreignField: "_id",
                        as: "business_type_data"
                    },
                },
                { $unwind: { path: "$business_type_data", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        '_id': '$_id',
                        'fullName': { $first: '$fullName' },
                        'email': { $first: '$email' },
                        'countryCode': { $first: '$countryCode' },
                        'phone': { $first: '$phone' },
                        'business_type': { $first: '$business_type_data.title' },
                        'signupCompleted': { $first: '$signupCompleted' },
                        'isEmailVerified': { $first: '$isEmailVerified' },
                        'isPhoneVerified': { $first: '$isPhoneVerified' },
                        'isDeleted': { $first: '$isDeleted' },
                        'status': { $first: '$status' },
                        'user_role': { $first: '$user_role' },
                        'profile_image': { $first: '$profile_image' },
                        'createdAt': { $first: '$createdAt' }
                    }
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
UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=users.repository.js.map