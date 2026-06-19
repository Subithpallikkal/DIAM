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
exports.RequiredDocumentListItemDto = exports.UpsertRequiredDocumentDto = exports.UpdateRequiredDocumentDto = exports.CreateRequiredDocumentDto = exports.ScopeListItemDto = exports.CreateScopeDto = exports.EngagementDetailDto = exports.EngagementListItemDto = exports.UpsertEngagementDto = exports.UpdateEngagementDto = exports.CreateEngagementDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const engagement_dto_1 = require("../common/engagement.dto");
class CreateEngagementDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: true, type: () => Number }, title: { required: true, type: () => String, minLength: 1 }, auditType: { required: true, type: () => String, minLength: 1 }, financialYear: { required: false, type: () => String }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, status: { required: false, enum: require("../common/engagement.dto").EngagementStatus }, description: { required: false, type: () => String } };
    }
}
exports.CreateEngagementDto = CreateEngagementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "Client uid" }),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateEngagementDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateEngagementDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateEngagementDto.prototype, "auditType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2025-26" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEngagementDto.prototype, "financialYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-04-01" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEngagementDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-06-30" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEngagementDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: engagement_dto_1.EngagementStatus, example: engagement_dto_1.EngagementStatus.DRAFT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(engagement_dto_1.EngagementStatus),
    __metadata("design:type", String)
], CreateEngagementDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Annual statutory audit" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEngagementDto.prototype, "description", void 0);
class UpdateEngagementDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: false, type: () => Number }, title: { required: false, type: () => String, minLength: 1 }, auditType: { required: false, type: () => String, minLength: 1 }, financialYear: { required: false, type: () => String }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, status: { required: false, enum: require("../common/engagement.dto").EngagementStatus }, description: { required: false, type: () => String } };
    }
}
exports.UpdateEngagementDto = UpdateEngagementDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateEngagementDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Financial Audit 2026" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateEngagementDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Financial" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateEngagementDto.prototype, "auditType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2025-26" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEngagementDto.prototype, "financialYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-04-01" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateEngagementDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-06-30" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateEngagementDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: engagement_dto_1.EngagementStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(engagement_dto_1.EngagementStatus),
    __metadata("design:type", String)
], UpdateEngagementDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEngagementDto.prototype, "description", void 0);
class UpsertEngagementDto extends UpdateEngagementDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number } };
    }
}
exports.UpsertEngagementDto = UpsertEngagementDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: "When set, updates the existing engagement" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpsertEngagementDto.prototype, "id", void 0);
class EngagementListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, clientId: { required: true, type: () => Number }, clientName: { required: true, type: () => String }, title: { required: true, type: () => String }, auditType: { required: true, type: () => String }, financialYear: { required: true, type: () => String, nullable: true }, status: { required: true, type: () => String }, startDate: { required: true, type: () => Date, nullable: true }, endDate: { required: true, type: () => Date, nullable: true }, createdAt: { required: true, type: () => Date } };
    }
}
exports.EngagementListItemDto = EngagementListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EngagementListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EngagementListItemDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ABC Pvt Ltd" }),
    __metadata("design:type", String)
], EngagementListItemDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026" }),
    __metadata("design:type", String)
], EngagementListItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial" }),
    __metadata("design:type", String)
], EngagementListItemDto.prototype, "auditType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-26", nullable: true }),
    __metadata("design:type", Object)
], EngagementListItemDto.prototype, "financialYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: engagement_dto_1.EngagementStatus, example: engagement_dto_1.EngagementStatus.DRAFT }),
    __metadata("design:type", String)
], EngagementListItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-04-01T00:00:00.000Z", nullable: true }),
    __metadata("design:type", Object)
], EngagementListItemDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-30T00:00:00.000Z", nullable: true }),
    __metadata("design:type", Object)
], EngagementListItemDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-13T07:18:47.000Z" }),
    __metadata("design:type", Date)
], EngagementListItemDto.prototype, "createdAt", void 0);
class EngagementDetailDto extends EngagementListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { description: { required: true, type: () => String, nullable: true }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.EngagementDetailDto = EngagementDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Annual statutory audit", nullable: true }),
    __metadata("design:type", Object)
], EngagementDetailDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-13T07:18:47.000Z" }),
    __metadata("design:type", Date)
], EngagementDetailDto.prototype, "updatedAt", void 0);
class CreateScopeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 1 }, description: { required: false, type: () => String } };
    }
}
exports.CreateScopeDto = CreateScopeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Sales" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateScopeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Review sales invoices and revenue recognition" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScopeDto.prototype, "description", void 0);
class ScopeListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, description: { required: true, type: () => String, nullable: true }, isActive: { required: true, type: () => Boolean } };
    }
}
exports.ScopeListItemDto = ScopeListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ScopeListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Sales" }),
    __metadata("design:type", String)
], ScopeListItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Review sales invoices", nullable: true }),
    __metadata("design:type", Object)
], ScopeListItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ScopeListItemDto.prototype, "isActive", void 0);
class CreateRequiredDocumentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { documentName: { required: true, type: () => String, minLength: 1 }, isRequired: { required: false, type: () => Boolean } };
    }
}
exports.CreateRequiredDocumentDto = CreateRequiredDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Bank Statement" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateRequiredDocumentDto.prototype, "documentName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRequiredDocumentDto.prototype, "isRequired", void 0);
class UpdateRequiredDocumentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { isReceived: { required: false, type: () => Boolean }, isRequired: { required: false, type: () => Boolean } };
    }
}
exports.UpdateRequiredDocumentDto = UpdateRequiredDocumentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRequiredDocumentDto.prototype, "isReceived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRequiredDocumentDto.prototype, "isRequired", void 0);
class UpsertRequiredDocumentDto extends UpdateRequiredDocumentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number }, documentName: { required: false, type: () => String, minLength: 1 } };
    }
}
exports.UpsertRequiredDocumentDto = UpsertRequiredDocumentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: "When set, updates the existing checklist item" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpsertRequiredDocumentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Bank Statement" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpsertRequiredDocumentDto.prototype, "documentName", void 0);
class RequiredDocumentListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, documentName: { required: true, type: () => String }, isRequired: { required: true, type: () => Boolean }, isReceived: { required: true, type: () => Boolean } };
    }
}
exports.RequiredDocumentListItemDto = RequiredDocumentListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RequiredDocumentListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Bank Statement" }),
    __metadata("design:type", String)
], RequiredDocumentListItemDto.prototype, "documentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], RequiredDocumentListItemDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], RequiredDocumentListItemDto.prototype, "isReceived", void 0);
//# sourceMappingURL=engagement.dto.js.map