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
exports.ServiceSchema = exports.Service = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
let Service = class Service {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Service.prototype, "taskDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ["Single", "Multi", "Team"],
        default: "Single",
    }),
    __metadata("design:type", String)
], Service.prototype, "requestType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Service.prototype, "project", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Service.prototype, "beginDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Service.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Service.prototype, "manDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Service.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 1 }),
    __metadata("design:type", Number)
], Service.prototype, "specialistsRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 1 }),
    __metadata("design:type", Number)
], Service.prototype, "offersRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Service.prototype, "consumerFirstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Service.prototype, "consumerLastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "" }),
    __metadata("design:type", String)
], Service.prototype, "representatives", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Service.prototype, "masterAgreementId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ["Consulting and Development", "Operations", "Data", "IT Security"],
        required: true,
    }),
    __metadata("design:type", String)
], Service.prototype, "domain", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ["Junior", "Senior", "Intermediate", "Principal"],
        required: true,
    }),
    __metadata("design:type", String)
], Service.prototype, "experienceLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Service.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "Common" }),
    __metadata("design:type", String)
], Service.prototype, "technologyLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Service.prototype, "technology", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Service.prototype, "locationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "" }),
    __metadata("design:type", String)
], Service.prototype, "document", void 0);
Service = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false })
], Service);
exports.Service = Service;
exports.ServiceSchema = mongoose_1.SchemaFactory.createForClass(Service);
exports.ServiceSchema.plugin(mongooseAggregatePaginate);
//# sourceMappingURL=service.schema.js.map