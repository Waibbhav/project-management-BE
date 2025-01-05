"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepositoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const service_schema_1 = require("../schemas/service.schema");
const _1 = require(".");
let ServiceRepositoryModule = class ServiceRepositoryModule {
};
ServiceRepositoryModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: service_schema_1.Service.name,
                    useFactory: () => {
                        const schema = service_schema_1.ServiceSchema;
                        return schema;
                    },
                },
            ]),
        ],
        controllers: [],
        providers: [_1.ServiceRepository],
        exports: [_1.ServiceRepository],
    })
], ServiceRepositoryModule);
exports.ServiceRepositoryModule = ServiceRepositoryModule;
//# sourceMappingURL=service.repository.module.js.map