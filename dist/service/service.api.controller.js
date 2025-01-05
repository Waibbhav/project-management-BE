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
exports.ServiceApiController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const multer_1 = require("multer");
const dto_1 = require("./dto");
const repositories_1 = require("./repositories");
const service_service_1 = require("./service.service");
const fileFieldsInterceptor = (0, platform_express_1.FileFieldsInterceptor)([{ name: "document", maxCount: 1 }], {
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
let ServiceApiController = class ServiceApiController {
    constructor(serviceService, serviceRepo) {
        this.serviceService = serviceService;
        this.serviceRepo = serviceRepo;
    }
    async createService(dto, req, res) {
        try {
            const result = await this.serviceService.createService(dto, req.body.files);
            if (result.success) {
                res.status(200).json({
                    status: result.status,
                    data: result.data,
                    message: result.message,
                });
            }
            else {
                res.status(500).json({
                    status: 500,
                    data: result.data,
                    message: result.message,
                });
            }
        }
        catch (error) {
            res.status(500).json({ status: 500, data: [], message: error.message });
        }
    }
};
__decorate([
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)("service/create"),
    (0, decorators_1.UseInterceptors)(fileFieldsInterceptor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateServiceDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceApiController.prototype, "createService", null);
ServiceApiController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [service_service_1.ServiceService,
        repositories_1.ServiceRepository])
], ServiceApiController);
exports.ServiceApiController = ServiceApiController;
//# sourceMappingURL=service.api.controller.js.map