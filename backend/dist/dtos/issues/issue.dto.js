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
exports.IssueDetailDto = exports.IssueStatusLogDto = exports.FindingDto = exports.IssueListItemDto = exports.CreateFindingDto = exports.AssignIssueDto = exports.UpsertIssueDto = exports.UpdateIssueDto = exports.CreateIssueDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enums_dto_1 = require("../common/enums.dto");
class CreateIssueDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 1 }, description: { required: false, type: () => String }, severity: { required: false, enum: require("../common/enums.dto").Priority }, responsiblePerson: { required: false, type: () => String } };
    }
}
exports.CreateIssueDto = CreateIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "GST filing delayed" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "GSTR-3B not filed for March 2026" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.Priority, example: enums_dto_1.Priority.HIGH }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.Priority),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Finance Manager" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "responsiblePerson", void 0);
class UpdateIssueDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, minLength: 1 }, description: { required: false, type: () => String }, severity: { required: false, enum: require("../common/enums.dto").Priority }, status: { required: false, enum: require("../common/enums.dto").IssueStatus }, responsiblePerson: { required: false, type: () => String } };
    }
}
exports.UpdateIssueDto = UpdateIssueDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.Priority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.Priority),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.IssueStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.IssueStatus),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "responsiblePerson", void 0);
class UpsertIssueDto extends UpdateIssueDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number } };
    }
}
exports.UpsertIssueDto = UpsertIssueDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: "When set, updates the existing issue" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpsertIssueDto.prototype, "id", void 0);
class AssignIssueDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { assignedToId: { required: true, type: () => Number } };
    }
}
exports.AssignIssueDto = AssignIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AssignIssueDto.prototype, "assignedToId", void 0);
class CreateFindingDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 1 }, description: { required: false, type: () => String }, severity: { required: false, enum: require("../common/enums.dto").Priority } };
    }
}
exports.CreateFindingDto = CreateFindingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Missing input tax credit reconciliation" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateFindingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFindingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.Priority, example: enums_dto_1.Priority.MEDIUM }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.Priority),
    __metadata("design:type", String)
], CreateFindingDto.prototype, "severity", void 0);
class IssueListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, engagementId: { required: true, type: () => Number }, engagementTitle: { required: true, type: () => String }, title: { required: true, type: () => String }, severity: { required: true, type: () => String }, status: { required: true, type: () => String }, responsiblePerson: { required: true, type: () => String, nullable: true }, findingsCount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date } };
    }
}
exports.IssueListItemDto = IssueListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], IssueListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], IssueListItemDto.prototype, "engagementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026" }),
    __metadata("design:type", String)
], IssueListItemDto.prototype, "engagementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "GST filing delayed" }),
    __metadata("design:type", String)
], IssueListItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_dto_1.Priority }),
    __metadata("design:type", String)
], IssueListItemDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_dto_1.IssueStatus }),
    __metadata("design:type", String)
], IssueListItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], IssueListItemDto.prototype, "responsiblePerson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], IssueListItemDto.prototype, "findingsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], IssueListItemDto.prototype, "createdAt", void 0);
class FindingDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, description: { required: true, type: () => String, nullable: true }, severity: { required: true, type: () => String }, createdByName: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
}
exports.FindingDto = FindingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], FindingDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FindingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], FindingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_dto_1.Priority }),
    __metadata("design:type", String)
], FindingDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Demo Auditor" }),
    __metadata("design:type", String)
], FindingDto.prototype, "createdByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], FindingDto.prototype, "createdAt", void 0);
class IssueStatusLogDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, oldStatus: { required: true, type: () => String }, newStatus: { required: true, type: () => String }, changedByName: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
}
exports.IssueStatusLogDto = IssueStatusLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], IssueStatusLogDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IssueStatusLogDto.prototype, "oldStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IssueStatusLogDto.prototype, "newStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IssueStatusLogDto.prototype, "changedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], IssueStatusLogDto.prototype, "createdAt", void 0);
class IssueDetailDto extends IssueListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { description: { required: true, type: () => String, nullable: true }, assigneeName: { required: true, type: () => String, nullable: true }, findings: { required: true, type: () => [require("./issue.dto").FindingDto] }, statusLogs: { required: true, type: () => [require("./issue.dto").IssueStatusLogDto] }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.IssueDetailDto = IssueDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], IssueDetailDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Demo Auditor", nullable: true }),
    __metadata("design:type", Object)
], IssueDetailDto.prototype, "assigneeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FindingDto] }),
    __metadata("design:type", Array)
], IssueDetailDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [IssueStatusLogDto] }),
    __metadata("design:type", Array)
], IssueDetailDto.prototype, "statusLogs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], IssueDetailDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=issue.dto.js.map