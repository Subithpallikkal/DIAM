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
exports.MeResponseDto = exports.LoginResponseDto = exports.AuthUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const role_dto_1 = require("../common/role.dto");
class AuthUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { uid: { required: true, type: () => Number }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, role: { required: true, enum: require("../common/role.dto").RoleName } };
    }
}
exports.AuthUserDto = AuthUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], AuthUserDto.prototype, "uid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Admin" }),
    __metadata("design:type", String)
], AuthUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "admin@gmail.com" }),
    __metadata("design:type", String)
], AuthUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: role_dto_1.RoleName, example: role_dto_1.RoleName.ADMIN }),
    __metadata("design:type", String)
], AuthUserDto.prototype, "role", void 0);
class LoginResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { accessToken: { required: true, type: () => String }, user: { required: true, type: () => require("./auth-response.dto").AuthUserDto } };
    }
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AuthUserDto }),
    __metadata("design:type", AuthUserDto)
], LoginResponseDto.prototype, "user", void 0);
class MeResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { uid: { required: true, type: () => Number }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, role: { required: true, enum: require("../common/role.dto").RoleName } };
    }
}
exports.MeResponseDto = MeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MeResponseDto.prototype, "uid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Admin" }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "admin@gmail.com" }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: role_dto_1.RoleName, example: role_dto_1.RoleName.ADMIN }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "role", void 0);
//# sourceMappingURL=auth-response.dto.js.map