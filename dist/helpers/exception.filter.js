"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = exports.EntityNotFoundExceptionFilter = exports.API_AuthFilter = exports.AdminAuthFilter = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let AdminAuthFilter = class AdminAuthFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        response.status(status).redirect('/');
    }
};
AdminAuthFilter = __decorate([
    (0, common_1.Catch)(common_2.UnauthorizedException)
], AdminAuthFilter);
exports.AdminAuthFilter = AdminAuthFilter;
let API_AuthFilter = class API_AuthFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        response.status(status).send({ status: status, data: null, message: "Unauthorised access request!" });
    }
};
API_AuthFilter = __decorate([
    (0, common_1.Catch)(common_2.UnauthorizedException)
], API_AuthFilter);
exports.API_AuthFilter = API_AuthFilter;
let EntityNotFoundExceptionFilter = class EntityNotFoundExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        if (request.path.includes('api')) {
            return response.status(status).send({ status: status, error: 'Not Found', data: null, message: exception.message });
        }
        return response.status(status).render("error/404.ejs", {
            page_name: 'error-management',
            page_title: 'Error 404 - Page Not Found',
        });
    }
};
EntityNotFoundExceptionFilter = __decorate([
    (0, common_1.Catch)(common_2.NotFoundException, Error)
], EntityNotFoundExceptionFilter);
exports.EntityNotFoundExceptionFilter = EntityNotFoundExceptionFilter;
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        response
            .status(status)
            .json({
            status: status,
            data: null,
            message: exception.message,
        });
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=exception.filter.js.map