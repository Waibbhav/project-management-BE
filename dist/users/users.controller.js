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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const exception_filters_decorator_1 = require("@nestjs/common/decorators/core/exception-filters.decorator");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const multer_1 = require("multer");
const helpers_1 = require("../helpers");
const dto_1 = require("./dto");
const repositories_1 = require("./repositories");
const users_service_1 = require("./users.service");
const fileFieldsInterceptor = (0, platform_express_1.FileFieldsInterceptor)([
    { name: 'profile_image', maxCount: 1 },
], {
    storage: (0, multer_1.diskStorage)({
        destination(req, file, callback) {
            if (!(0, fs_1.existsSync)("./public/uploads/user")) {
                (0, fs_1.mkdirSync)("./public/uploads/user");
            }
            callback(null, "./public/uploads/user");
        },
        filename(req, file, callback) {
            callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
        },
    })
});
let UsersController = class UsersController {
    constructor(userService, userRepo) {
        this.userService = userService;
        this.userRepo = userRepo;
    }
    async loginScreen(req, res) {
        try {
            req.session && req.session['token'] && res.redirect('/dashboard');
            (!req.session || !req.session['token']) && res.render('users/login.ejs', {});
        }
        catch (error) {
            console.error(error);
            throw new common_1.ForbiddenException(error.message);
        }
    }
    async signin(dto, req, res) {
        try {
            const result = await this.userService.signin(dto);
            req.flash(result.type, result.message);
            result.success && ((req.session['token'] = result.data.token) && res.redirect('/dashboard'));
            !result.success && (res.redirect('/'));
        }
        catch (error) {
            console.error(error, 'error signin');
            throw new common_1.ForbiddenException(error.message);
        }
    }
    ;
    async forgetPassword(dto, req, res) {
        try {
            const result = await this.userService.forgetPassword(dto, 'backend');
            req.flash(result.type, result.message);
            res.redirect('/');
        }
        catch (error) {
            console.error(error, 'error signin');
            throw new common_1.ForbiddenException(error.message);
        }
    }
    ;
    async dashboard(req, res) {
        try {
            const stats = await this.userService.dashboardPageStats();
            res.render('users/dashboard.ejs', {
                page_name: 'user-dashboard',
                page_title: 'Dashboard',
                user: req.user,
                stats
            });
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async logout(req, res) {
        try {
            req.session.destroy(function (err) {
                res.redirect('/');
            });
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async account(req, res) {
        try {
            res.render('users/admin-account.ejs', {
                page_name: 'admin-account',
                page_title: 'Account',
                user: req.user,
                response: req.user,
            });
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async accountSubmit(files, dto, req, res) {
        try {
            const result = await this.userService.accountSubmit(dto, files, req.user);
            req.flash(result.type, result.message);
            result.success && res.redirect('/dashboard');
            !result.success && res.redirect('/account');
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async settings(req, res) {
        try {
            res.render('users/admin-security.ejs', {
                page_name: 'admin-security',
                page_title: 'Settings',
                user: req.user,
                response: req.user,
            });
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async adminChangePasswordSubmit(dto, req, res) {
        try {
            const result = await this.userService.adminChangePasswordSubmit(dto, req.user);
            req.flash(result.type, result.message);
            result.success && res.redirect('/dashboard');
            !result.success && res.redirect('/settings');
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async userListView(req, res) {
        try {
            const stats = await this.userService.userListPageStats();
            res.render('users/list.ejs', {
                page_name: 'user-management',
                page_title: 'Buyers',
                user: req.user,
                stats,
            });
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async getAllUser(req, res) {
        try {
            const result = await this.userService.getAllUser(req);
            res.status(result.status).send(result);
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/dashboard');
        }
    }
    async userStore(files, dto, req, res) {
        try {
            console.log(dto);
            const result = await this.userService.userCreateFromAdmin(dto, files);
            req.flash(result.type, result.message);
            result.success && res.redirect('/users/view/' + result.data._id);
            !result.success && res.redirect('/users/list');
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async statusChange(req, res) {
        try {
            const result = await this.userService.statusChange(req.params.id, req.query.status);
            req.flash(result.type, result.message);
            req.query.path ? res.redirect(req.query.path) : res.redirect('/users/list');
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async deleteAccount(req, res) {
        try {
            const result = await this.userService.deleteAccount(req.params.id);
            req.flash(result.type, result.message);
            res.redirect('/users/list');
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async verifyEmailOrPhoneForcefully(req, res) {
        try {
            const result = await this.userService.verifyEmailOrPhoneForcefully(req.params.id, req.query.type);
            req.flash(result.type, result.message);
            req.query.path ? res.redirect(req.query.path) : res.redirect('/users/list');
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async userAccountView(req, res) {
        try {
            const result = await this.userService.userDetails(req.params.id);
            const user_primary_details = await this.userRepo.userPrimaryDetails(req.params.id);
            const data = result.data;
            if (data) {
                res.render('users/user-account.ejs', {
                    page_name: 'user-management',
                    page_title: 'Account Details for ' + data.fullName,
                    user: req.user,
                    response: data,
                    user_primary_details: user_primary_details[0],
                });
            }
            else {
                req.flash(result.type, result.message);
                res.redirect('/users/list');
            }
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async userAccountUpdate(files, dto, req, res) {
        try {
            const result = await this.userService.userCreateFromAdmin(dto, files);
            req.flash(result.type, result.message);
            res.redirect('/users/view/' + dto.id);
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
    async resetUserPassword(req, res) {
        try {
            const { data, type, message } = await this.userService.userDetails(req.params.id);
            if (type == 'error') {
                req.flash(type, message);
            }
            else if (data.signupType != 'Normal') {
                req.flash("error", "User has signed up using social accounts. Hence this account cannot be used for password authentication.");
            }
            else if (!data.email) {
                req.flash("error", "User hasn\'t provided any email address yet. Hence this account cannot be used for password authentication.");
            }
            else {
                const result = await this.userService.forgetPassword({ email: data.email }, 'frontend');
                req.flash(result.type, result.message);
            }
            res.redirect('/users/view/' + req.params.id);
        }
        catch (error) {
            console.error(error);
            res.redirect('/');
        }
    }
    ;
    async userChangePasswordSubmit(dto, req, res) {
        try {
            const result = await this.userService.userChangePasswordSubmit(dto);
            req.flash(result.type, result.message);
            res.redirect('/users/view/' + dto.id);
        }
        catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "loginScreen", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SigninDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('forget-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ForgetPwdDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "forgetPassword", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "dashboard", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('account'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "account", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Post)('account'),
    (0, decorators_1.UseInterceptors)(fileFieldsInterceptor),
    __param(0, (0, decorators_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, dto_1.AdminAccountDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "accountSubmit", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('settings'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "settings", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AdminChangePasswordDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "adminChangePasswordSubmit", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('users/list'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userListView", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Post)('users/getall'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUser", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Post)('/users/store'),
    (0, decorators_1.UseInterceptors)(fileFieldsInterceptor),
    __param(0, (0, decorators_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, dto_1.UserCreateFromAdminDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userStore", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('users/status-change/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "statusChange", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('users/delete/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAccount", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('users/verify-forcefully/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyEmailOrPhoneForcefully", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('users/view/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userAccountView", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Post)('users/update'),
    (0, decorators_1.UseInterceptors)(fileFieldsInterceptor),
    __param(0, (0, decorators_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, dto_1.UserCreateFromAdminDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userAccountUpdate", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Get)('users/reset-password/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetUserPassword", null);
__decorate([
    (0, decorators_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, exception_filters_decorator_1.UseFilters)(helpers_1.AdminAuthFilter),
    (0, common_1.Post)('users/change-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangePwdDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userChangePasswordSubmit", null);
UsersController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        repositories_1.UserRepository])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map