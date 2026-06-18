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
exports.ClientDetailDto = exports.ClientListItemDto = exports.UpdateClientDto = exports.CreateClientDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateClientDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 1 }, code: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, phone: { required: false, type: () => String }, address: { required: false, type: () => String }, gstNumber: { required: false, type: () => String } };
    }
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ABC Pvt Ltd" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "ABC001" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "contact@abc.com" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "+91-9876543210" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "123 Business Park, Mumbai" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "27AABCU9603R1ZM" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "gstNumber", void 0);
class UpdateClientDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 1 }, code: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, phone: { required: false, type: () => String }, address: { required: false, type: () => String }, gstNumber: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateClientDto = UpdateClientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "ABC Pvt Ltd" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "ABC001" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "contact@abc.com" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "+91-9876543210" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "123 Business Park, Mumbai" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "27AABCU9603R1ZM" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "gstNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateClientDto.prototype, "isActive", void 0);
class ClientListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, email: { required: true, type: () => String, nullable: true }, phone: { required: true, type: () => String, nullable: true }, gstNumber: { required: true, type: () => String, nullable: true }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date } };
    }
}
exports.ClientListItemDto = ClientListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ClientListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ABC Pvt Ltd" }),
    __metadata("design:type", String)
], ClientListItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "contact@abc.com", nullable: true }),
    __metadata("design:type", Object)
], ClientListItemDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "+91-9876543210", nullable: true }),
    __metadata("design:type", Object)
], ClientListItemDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "27AABCU9603R1ZM", nullable: true }),
    __metadata("design:type", Object)
], ClientListItemDto.prototype, "gstNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ClientListItemDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-13T07:18:47.000Z" }),
    __metadata("design:type", Date)
], ClientListItemDto.prototype, "createdAt", void 0);
class ClientDetailDto extends ClientListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, nullable: true }, address: { required: true, type: () => String, nullable: true }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.ClientDetailDto = ClientDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ABC001", nullable: true }),
    __metadata("design:type", Object)
], ClientDetailDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123 Business Park, Mumbai", nullable: true }),
    __metadata("design:type", Object)
], ClientDetailDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-13T07:18:47.000Z" }),
    __metadata("design:type", Date)
], ClientDetailDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=client.dto.js.map