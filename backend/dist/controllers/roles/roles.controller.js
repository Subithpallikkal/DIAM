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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_service_1 = require("../../services/roles/roles.service");
const role_dto_1 = require("../../dtos/roles/role.dto");
const permission_grid_dto_1 = require("../../dtos/roles/permission-grid.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const role_dto_2 = require("../../dtos/common/role.dto");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    findAll() {
        return this.rolesService.findAll();
    }
    getPermissionGrid(role) {
        return this.rolesService.getPermissionGrid(role);
    }
    updatePermissionGrid(role, dto) {
        return this.rolesService.updatePermissionGrid(role, dto);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List roles with permissions (Admin/Manager)" }),
    (0, swagger_1.ApiOkResponse)({ description: "Roles and permissions", type: [role_dto_1.RoleDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Get)(":role/permissions"),
    (0, swagger_1.ApiOperation)({ summary: "Get permission grid for a role" }),
    (0, swagger_1.ApiParam)({ name: "role", enum: role_dto_2.RoleName, example: role_dto_2.RoleName.MANAGER }),
    (0, swagger_1.ApiOkResponse)({ description: "Permission grid", type: permission_grid_dto_1.PermissionGridDto }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getPermissionGrid", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_ONLY),
    (0, common_1.Patch)(":role/permissions"),
    (0, swagger_1.ApiOperation)({ summary: "Update permission grid for a role (Admin only)" }),
    (0, swagger_1.ApiParam)({ name: "role", enum: role_dto_2.RoleName, example: role_dto_2.RoleName.MANAGER }),
    (0, swagger_1.ApiOkResponse)({ description: "Updated permission grid", type: permission_grid_dto_1.PermissionGridDto }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("role")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, permission_grid_dto_1.UpdatePermissionGridDto]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "updatePermissionGrid", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)("Roles"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("roles"),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map