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
exports.CreateServiceDTO = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_validator_2 = require("class-validator");
class CreateServiceDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Task description for the service request" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "taskDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type of request (Single, Multi, or Team)",
        enum: ["Single", "Multi", "Team"],
        default: "Single",
    }),
    (0, class_validator_2.IsEnum)(["Single", "Multi", "Team"]),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "requestType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Project for which the task is required" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Start date of the service request" }),
    (0, class_validator_2.IsDate)(),
    __metadata("design:type", Date)
], CreateServiceDTO.prototype, "beginDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "End date of the service request" }),
    (0, class_validator_2.IsDate)(),
    __metadata("design:type", Date)
], CreateServiceDTO.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total amount of man days" }),
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], CreateServiceDTO.prototype, "manDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "City/town for the location of the service" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Number of specialists required" }),
    (0, class_validator_2.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDTO.prototype, "specialistsRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Number of offers from each provider required" }),
    (0, class_validator_2.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDTO.prototype, "offersRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "First name of the consumer (service request creator)",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "consumerFirstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Last name of the consumer (service request creator)",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "consumerLastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Optional contact for representatives" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "representatives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Master Agreement ID associated with the service request",
    }),
    (0, class_validator_2.IsMongoId)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "masterAgreementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Domain for the service request",
        enum: ["Consulting and Development", "Operations", "Data", "IT Security"],
    }),
    (0, class_validator_2.IsEnum)(["Consulting and Development", "Operations", "Data", "IT Security"]),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Experience level required for the role",
        enum: ["Junior", "Senior", "Intermediate", "Principal"],
    }),
    (0, class_validator_2.IsEnum)(["Junior", "Senior", "Intermediate", "Principal"]),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "experienceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Role required for the service request" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Technology expertise level (Common, Uncommon, Rare)",
        enum: ["Common", "Uncommon", "Rare"],
        default: "Common",
    }),
    (0, class_validator_2.IsEnum)(["Common", "Uncommon", "Rare"]),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "technologyLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Technology for the service request" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "technology", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Location type for the service request",
        enum: ["Onshore", "Nearshore", "Farshore"],
    }),
    (0, class_validator_2.IsEnum)(["Onshore", "Nearshore", "Farshore"]),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "locationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Document (PDF/Word) with further details for the request",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "document", void 0);
exports.CreateServiceDTO = CreateServiceDTO;
//# sourceMappingURL=service.dto.js.map