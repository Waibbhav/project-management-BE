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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const repositories_1 = require("./repositories");
const mongoose = require('mongoose');
const _ = require("underscore");
let CmsService = class CmsService {
    constructor(cmsRepo) {
        this.cmsRepo = cmsRepo;
    }
    async getAll(req) {
        try {
            const start = +req.body.start;
            const length = +req.body.length;
            let currentPage = 1;
            if (start > 0) {
                currentPage = Math.round((start + length) / length);
            }
            req.body.page = currentPage;
            let cmsData = await this.cmsRepo.getAll(req);
            let data = {
                "recordsTotal": cmsData.totalDocs,
                "recordsFiltered": cmsData.totalDocs,
                "data": cmsData.docs
            };
            return {
                status: 200,
                data: data,
                message: `Data fetched successfully.`
            };
        }
        catch (error) {
            console.error(error);
            return {
                status: 500,
                data: {
                    "recordsTotal": 0,
                    "recordsFiltered": 0,
                    "data": []
                },
                message: error.message
            };
        }
    }
    ;
    async update(body) {
        try {
            const cmsId = mongoose.Types.ObjectId(body.id);
            let cmsData = await this.cmsRepo.getByField({ 'title': body.title, _id: { $ne: cmsId }, isDeleted: false });
            if (_.isEmpty(cmsData)) {
                if (!body['content']) {
                    return { success: false, type: "error", message: "Content is required." };
                }
                else {
                    if (body.slug) {
                        body.slug = body.slug.replace(/\s/g, '');
                        let alreadyExist = await this.cmsRepo.getByField({ 'slug': body.slug, _id: { $ne: cmsId }, isDeleted: false });
                        if (alreadyExist) {
                            return { success: false, type: "error", message: "CMS is already availabe!" };
                        }
                    }
                    let cmsUpdate = await this.cmsRepo.updateById(body, cmsId);
                    if (cmsUpdate && cmsUpdate._id) {
                        return { success: true, type: "success", message: "CMS Updated Successfully" };
                    }
                    else {
                        return { success: false, type: "error", message: "Failed to update CMS content!" };
                    }
                }
            }
            else {
                return { success: false, type: "error", message: "CMS is already availabe with same title!" };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: 'error', message: error.message };
        }
    }
    ;
    async getBySlug(slug) {
        try {
            const data = await this.cmsRepo.getByFieldWithProjection({ slug: slug, isDeleted: false }, { _id: 0, title: 1, content: 1 });
            if (data)
                return { success: true, type: 'success', message: "CMS fetched successfully!", data };
            return { success: false, type: 'error', message: "No such page found!", data: null };
        }
        catch (error) {
            return { success: false, type: 'error', message: error.message, data: null };
        }
    }
    ;
    async listAllSlug() {
        try {
            const data = await this.cmsRepo.getAllByFieldWithProjection({ status: 'Active', isDeleted: false }, { _id: 0, slug: 1, title: 1 });
            if (data)
                return { success: true, type: 'success', message: "CMS slugs fetched successfully!", data };
            return { success: false, type: 'error', message: "Nothing found!", data: [] };
        }
        catch (error) {
            return { success: false, type: 'error', message: error.message, data: [] };
        }
    }
    ;
};
CmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repositories_1.CmsRepository])
], CmsService);
exports.CmsService = CmsService;
//# sourceMappingURL=cms.service.js.map