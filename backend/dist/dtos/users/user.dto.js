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
exports.UserDetailDto = exports.UserListItemDto = exports.UpsertUserDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const role_dto_1 = require("../common/role.dto");
class CreateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 1 }, email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String, minLength: 8 }, role: { required: true, enum: require("../common/role.dto").RoleName } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Jane Auditor" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "jane@company.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "SecurePass123" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: role_dto_1.RoleName, example: role_dto_1.RoleName.AUDITOR }),
    (0, class_validator_1.IsEnum)(role_dto_1.RoleName),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
class UpdateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 1 }, email: { required: false, type: () => String, format: "email" }, password: { required: false, type: () => String, minLength: 8 }, role: { required: false, enum: require("../common/role.dto").RoleName }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Jane Auditor" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "jane@company.com" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "NewSecurePass123" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: role_dto_1.RoleName, example: role_dto_1.RoleName.MANAGER }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(role_dto_1.RoleName),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
class UpsertUserDto extends UpdateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number } };
    }
}
exports.UpsertUserDto = UpsertUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: "When set, updates the existing user" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpsertUserDto.prototype, "id", void 0);
class UserListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, role: { required: true, enum: require("../common/role.dto").RoleName }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date } };
    }
}
exports.UserListItemDto = UserListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], UserListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Demo Admin" }),
    __metadata("design:type", String)
], UserListItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "admin@demo.com" }),
    __metadata("design:type", String)
], UserListItemDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: role_dto_1.RoleName, example: role_dto_1.RoleName.ADMIN }),
    __metadata("design:type", String)
], UserListItemDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserListItemDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-13T07:18:47.000Z" }),
    __metadata("design:type", Date)
], UserListItemDto.prototype, "createdAt", void 0);
class UserDetailDto extends UserListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { updatedAt: { required: true, type: () => Date } };
    }
}
exports.UserDetailDto = UserDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-13T07:18:47.000Z" }),
    __metadata("design:type", Date)
], UserDetailDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=user.dto.js.map