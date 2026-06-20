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
exports.DocumentLogDto = exports.DocumentListItemDto = exports.DocumentCategoryDto = exports.CreateDocumentCategoryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDocumentCategoryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 1 }, description: { required: false, type: () => String } };
    }
}
exports.CreateDocumentCategoryDto = CreateDocumentCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateDocumentCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Financial statements and records" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDocumentCategoryDto.prototype, "description", void 0);
class DocumentCategoryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, description: { required: true, type: () => String, nullable: true }, createdAt: { required: true, type: () => Date } };
    }
}
exports.DocumentCategoryDto = DocumentCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DocumentCategoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial" }),
    __metadata("design:type", String)
], DocumentCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial statements", nullable: true }),
    __metadata("design:type", Object)
], DocumentCategoryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-19T10:00:00.000Z" }),
    __metadata("design:type", Date)
], DocumentCategoryDto.prototype, "createdAt", void 0);
class DocumentListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, clientId: { required: true, type: () => Number }, clientName: { required: true, type: () => String }, engagementId: { required: true, type: () => Number, nullable: true }, engagementTitle: { required: true, type: () => String, nullable: true }, categoryId: { required: true, type: () => Number, nullable: true }, categoryName: { required: true, type: () => String, nullable: true }, originalName: { required: true, type: () => String }, mimeType: { required: true, type: () => String }, fileSize: { required: true, type: () => Number }, uploadedByName: { required: true, type: () => String }, version: { required: true, type: () => Number }, parentDocumentId: { required: true, type: () => Number, nullable: true }, rootDocumentId: { required: true, type: () => Number }, versionCount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date } };
    }
}
exports.DocumentListItemDto = DocumentListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DocumentListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DocumentListItemDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ABC Pvt Ltd" }),
    __metadata("design:type", String)
], DocumentListItemDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, nullable: true }),
    __metadata("design:type", Object)
], DocumentListItemDto.prototype, "engagementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026", nullable: true }),
    __metadata("design:type", Object)
], DocumentListItemDto.prototype, "engagementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, nullable: true }),
    __metadata("design:type", Object)
], DocumentListItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial", nullable: true }),
    __metadata("design:type", Object)
], DocumentListItemDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Bank Statement.pdf" }),
    __metadata("design:type", String)
], DocumentListItemDto.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "application/pdf" }),
    __metadata("design:type", String)
], DocumentListItemDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 102400 }),
    __metadata("design:type", Number)
], DocumentListItemDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Demo Auditor" }),
    __metadata("design:type", String)
], DocumentListItemDto.prototype, "uploadedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DocumentListItemDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, nullable: true }),
    __metadata("design:type", Object)
], DocumentListItemDto.prototype, "parentDocumentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DocumentListItemDto.prototype, "rootDocumentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DocumentListItemDto.prototype, "versionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-19T10:00:00.000Z" }),
    __metadata("design:type", Date)
], DocumentListItemDto.prototype, "createdAt", void 0);
class DocumentLogDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, action: { required: true, type: () => String }, performedByName: { required: true, type: () => String }, details: { required: true, type: () => String, nullable: true }, createdAt: { required: true, type: () => Date } };
    }
}
exports.DocumentLogDto = DocumentLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DocumentLogDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "DOWNLOAD" }),
    __metadata("design:type", String)
], DocumentLogDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Auditor" }),
    __metadata("design:type", String)
], DocumentLogDto.prototype, "performedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Downloaded for review", nullable: true }),
    __metadata("design:type", Object)
], DocumentLogDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-19T10:00:00.000Z" }),
    __metadata("design:type", Date)
], DocumentLogDto.prototype, "createdAt", void 0);
//# sourceMappingURL=document.dto.js.map