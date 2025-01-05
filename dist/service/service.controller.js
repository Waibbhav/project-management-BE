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
exports.ServiceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const multer_1 = require("multer");
const repositories_1 = require("./repositories");
const service_service_1 = require("./service.service");
const fileFieldsInterceptor = (0, platform_express_1.FileFieldsInterceptor)([{ name: "profile_image", maxCount: 1 }], {
    storage: (0, multer_1.diskStorage)({
        destination(req, file, callback) {
            if (!(0, fs_1.existsSync)("./public/uploads/user")) {
                (0, fs_1.mkdirSync)("./public/uploads/user");
            }
            callback(null, "./public/uploads/user");
        },
        filename(req, file, callback) {
            callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, "_"));
        },
    }),
});
let ServiceController = class ServiceController {
    constructor(serviceService, serviceRepo) {
        this.serviceService = serviceService;
        this.serviceRepo = serviceRepo;
    }
};
ServiceController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [service_service_1.ServiceService,
        repositories_1.ServiceRepository])
], ServiceController);
exports.ServiceController = ServiceController;
//# sourceMappingURL=service.controller.js.map