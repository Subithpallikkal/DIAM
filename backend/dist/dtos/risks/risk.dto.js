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
exports.AssignChecklistDto = exports.ChecklistItemDto = exports.UpdateChecklistItemDto = exports.CreateChecklistItemDto = exports.RiskListItemDto = exports.UpdateRiskDto = exports.CreateRiskDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enums_dto_1 = require("../common/enums.dto");
class CreateRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 1 }, description: { required: false, type: () => String }, priority: { required: false, enum: require("../common/enums.dto").Priority }, status: { required: false, enum: require("../common/enums.dto").RiskStatus } };
    }
}
exports.CreateRiskDto = CreateRiskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Cash handling control weak" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "No dual approval for cash disbursements" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.Priority, example: enums_dto_1.Priority.HIGH }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.Priority),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.RiskStatus, example: enums_dto_1.RiskStatus.OPEN }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.RiskStatus),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "status", void 0);
class UpdateRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, minLength: 1 }, description: { required: false, type: () => String }, priority: { required: false, enum: require("../common/enums.dto").Priority }, status: { required: false, enum: require("../common/enums.dto").RiskStatus } };
    }
}
exports.UpdateRiskDto = UpdateRiskDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.Priority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.Priority),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.RiskStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.RiskStatus),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "status", void 0);
class RiskListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, engagementId: { required: true, type: () => Number }, title: { required: true, type: () => String }, description: { required: true, type: () => String, nullable: true }, priority: { required: true, type: () => String }, status: { required: true, type: () => String }, checklistCount: { required: true, type: () => Number }, completedChecklistCount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date } };
    }
}
exports.RiskListItemDto = RiskListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RiskListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RiskListItemDto.prototype, "engagementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Cash handling control weak" }),
    __metadata("design:type", String)
], RiskListItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], RiskListItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_dto_1.Priority }),
    __metadata("design:type", String)
], RiskListItemDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_dto_1.RiskStatus }),
    __metadata("design:type", String)
], RiskListItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], RiskListItemDto.prototype, "checklistCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RiskListItemDto.prototype, "completedChecklistCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RiskListItemDto.prototype, "createdAt", void 0);
class CreateChecklistItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 1 }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.CreateChecklistItemDto = CreateChecklistItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Verify cash register" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateChecklistItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChecklistItemDto.prototype, "sortOrder", void 0);
class UpdateChecklistItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, minLength: 1 }, isCompleted: { required: false, type: () => Boolean }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.UpdateChecklistItemDto = UpdateChecklistItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateChecklistItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateChecklistItemDto.prototype, "isCompleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateChecklistItemDto.prototype, "sortOrder", void 0);
class ChecklistItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, isCompleted: { required: true, type: () => Boolean }, sortOrder: { required: true, type: () => Number }, assigneeName: { required: true, type: () => String, nullable: true } };
    }
}
exports.ChecklistItemDto = ChecklistItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ChecklistItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Verify cash register" }),
    __metadata("design:type", String)
], ChecklistItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ChecklistItemDto.prototype, "isCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], ChecklistItemDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], ChecklistItemDto.prototype, "assigneeName", void 0);
class AssignChecklistDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { assignedToId: { required: true, type: () => Number } };
    }
}
exports.AssignChecklistDto = AssignChecklistDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AssignChecklistDto.prototype, "assignedToId", void 0);
//# sourceMappingURL=risk.dto.js.map