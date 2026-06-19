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
exports.UpdatePermissionGridDto = exports.PermissionGridDto = exports.PermissionGroupDto = exports.PermissionResourceDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const role_dto_1 = require("../common/role.dto");
class PermissionResourceDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String }, label: { required: true, type: () => String }, permissions: { required: true, type: () => Object } };
    }
}
exports.PermissionResourceDto = PermissionResourceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "clients" }),
    __metadata("design:type", String)
], PermissionResourceDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Clients" }),
    __metadata("design:type", String)
], PermissionResourceDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            create: true,
            editOwn: true,
            editAny: true,
            deleteOwn: false,
            deleteAny: false,
        },
    }),
    __metadata("design:type", Object)
], PermissionResourceDto.prototype, "permissions", void 0);
class PermissionGroupDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String }, label: { required: true, type: () => String }, resources: { required: true, type: () => [require("./permission-grid.dto").PermissionResourceDto] } };
    }
}
exports.PermissionGroupDto = PermissionGroupDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "audit" }),
    __metadata("design:type", String)
], PermissionGroupDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Audit modules" }),
    __metadata("design:type", String)
], PermissionGroupDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PermissionResourceDto] }),
    __metadata("design:type", Array)
], PermissionGroupDto.prototype, "resources", void 0);
class PermissionGridDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { roleId: { required: true, type: () => Number }, role: { required: true, enum: require("../common/role.dto").RoleName }, description: { required: true, type: () => String }, groups: { required: true, type: () => [require("./permission-grid.dto").PermissionGroupDto] } };
    }
}
exports.PermissionGridDto = PermissionGridDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PermissionGridDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: role_dto_1.RoleName, example: role_dto_1.RoleName.MANAGER }),
    __metadata("design:type", String)
], PermissionGridDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Manage clients and audit engagements" }),
    __metadata("design:type", String)
], PermissionGridDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PermissionGroupDto] }),
    __metadata("design:type", Array)
], PermissionGridDto.prototype, "groups", void 0);
class UpdatePermissionGridDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { permissions: { required: true, type: () => Object } };
    }
}
exports.UpdatePermissionGridDto = UpdatePermissionGridDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            clients: { create: true, editAny: true },
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePermissionGridDto.prototype, "permissions", void 0);
//# sourceMappingURL=permission-grid.dto.js.map