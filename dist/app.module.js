"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const cms_repository_module_1 = require("./cms/repositories/cms_repository.module");
const strategy_module_1 = require("./users/strategy/strategy.module");
const helper_module_1 = require("./helpers/helper.module");
const userrepository_module_1 = require("./users/repositories/userrepository.module");
const users_module_1 = require("./users/users.module");
const role_module_1 = require("./role/role.module");
const cms_module_1 = require("./cms/cms.module");
const service_module_1 = require("./service/service.module");
const service_repository_module_1 = require("./service/repositories/service.repository.module");
const EventEmitterOptions = {
    wildcard: false,
    delimiter: '.',
    newListener: false,
    removeListener: false,
    maxListeners: 10,
    verboseMemoryLeak: false,
    ignoreErrors: false,
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: ".env",
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot("mongodb+srv://developer123:Developer%40123@cluster0.kcjuv.mongodb.net/servicemanagemantDB"),
            event_emitter_1.EventEmitterModule.forRoot(EventEmitterOptions),
            users_module_1.UsersModule,
            role_module_1.RoleModule,
            userrepository_module_1.UserRepositoryModule,
            helper_module_1.HelperModule,
            strategy_module_1.StrategyModule,
            cms_module_1.CmsModule,
            cms_repository_module_1.Cms_repositoryModule,
            service_module_1.ServiceModule,
            service_repository_module_1.ServiceRepositoryModule
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map