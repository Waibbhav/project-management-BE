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
exports.CmsApiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helpers_1 = require("../helpers");
const cms_service_1 = require("./cms.service");
let CmsApiController = class CmsApiController {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async listSlugs(res) {
        try {
            const result = await this.cmsService.listAllSlug();
            if (result.success) {
                res.status(200).json({ status: 200, data: result.data, message: result.message });
            }
            else {
                res.status(404).json({ status: 404, data: result.data, message: result.message });
            }
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                data: [],
                message: error.message,
            });
        }
    }
    ;
    async getBySlug(slug, res) {
        try {
            const result = await this.cmsService.getBySlug(slug);
            if (result.success) {
                res.status(200).json({ status: 200, data: result.data, message: result.message });
            }
            else {
                res.status(404).json({ status: 404, data: result.data, message: result.message });
            }
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: error.message,
            });
        }
    }
    ;
};
__decorate([
    (0, common_1.Get)('list-slugs'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: "List All CMS Available Slugs", description: "Get all available CMS page slugs." }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CMS slugs fetched successfully!' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nothing found!' }),
    (0, common_1.UseFilters)(helpers_1.HttpExceptionFilter),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CmsApiController.prototype, "listSlugs", null);
__decorate([
    (0, common_1.Get)('content/:slug'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: "CMS Content By Slug", description: "Get CMS page content by slug in url/path" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CMS fetched successfully!' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No such page found!' }),
    (0, common_1.UseFilters)(helpers_1.HttpExceptionFilter),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsApiController.prototype, "getBySlug", null);
CmsApiController = __decorate([
    (0, swagger_1.ApiTags)('CMS'),
    (0, common_1.Controller)('api/cms'),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsApiController);
exports.CmsApiController = CmsApiController;
//# sourceMappingURL=cmsapi.controller.js.map