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
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const exception_filters_decorator_1 = require("@nestjs/common/decorators/core/exception-filters.decorator");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const multer_1 = require("multer");
const helpers_1 = require("../helpers");
const cms_service_1 = require("./cms.service");
const fileFieldsInterceptor = (0, platform_express_1.FileFieldsInterceptor)([], {
    storage: (0, multer_1.diskStorage)({
        destination(req, file, callback) {
            if (!(0, fs_1.existsSync)("./public/uploads/cms")) {
                (0, fs_1.mkdirSync)("./public/uploads/cms");
            }
            callback(null, "./public/uploads/cms");
        },
        filename(req, file, callback) {
            callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
        },
    })
});
let CmsController = class CmsController {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async userListView(req, res) {
        try {
            res.render('cms/list.ejs', {
                page_name: 'cms-management',
                page_title: 'General CMS',
                user: req.user,
            });
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async getAll(req, res) {
        try {
            const result = await this.cmsService.getAll(req);
            res.status(result.status).send(result);
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/dashboard');
        }
    }
    async update(req, res) {
        try {
            const result = await this.cmsService.update(req.body);
            req.flash(result.type, result.message);
            res.redirect('/cms/list');
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/dashboard');
        }
    }
};
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "userListView", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Post)('getall'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getAll", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Post)('update'),
    (0, decorators_1.UseInterceptors)(fileFieldsInterceptor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "update", null);
CmsController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('cms'),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsController);
exports.CmsController = CmsController;
//# sourceMappingURL=cms.controller.js.map