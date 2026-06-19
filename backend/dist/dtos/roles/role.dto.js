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
exports.RoleDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const role_dto_1 = require("../common/role.dto");
class RoleDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, enum: require("../common/role.dto").RoleName }, description: { required: true, type: () => String }, permissions: { required: true, type: () => [String] } };
    }
}
exports.RoleDto = RoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RoleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: role_dto_1.RoleName, example: role_dto_1.RoleName.ADMIN }),
    __metadata("design:type", String)
], RoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Full system access" }),
    __metadata("design:type", String)
], RoleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ["Create, update, and deactivate users", "Manage clients and engagements"],
        type: [String],
    }),
    __metadata("design:type", Array)
], RoleDto.prototype, "permissions", void 0);
//# sourceMappingURL=role.dto.js.map