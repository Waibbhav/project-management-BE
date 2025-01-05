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
exports.ServiceService = void 0;
const common_1 = require("@nestjs/common");
const repositories_1 = require("./repositories");
const mongoose = require("mongoose");
const helpers_1 = require("../helpers");
let ServiceService = class ServiceService {
    constructor(serviceRepo, mailerService, utilsService) {
        this.serviceRepo = serviceRepo;
        this.mailerService = mailerService;
        this.utilsService = utilsService;
    }
    async createService(body, files) {
        try {
            const saveService = await this.serviceRepo.save(body);
            if (saveService && saveService._id) {
                return {
                    success: true,
                    type: "success",
                    data: saveService,
                    message: "Service Request created successfully!",
                    status: 200
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something went wrong",
                    status: 204
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
};
ServiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repositories_1.ServiceRepository,
        helpers_1.MailerService,
        helpers_1.UtilsService])
], ServiceService);
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map