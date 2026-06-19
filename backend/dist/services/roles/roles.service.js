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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const role_permissions_constants_1 = require("../../common/constants/role-permissions.constants");
const permission_grid_constants_1 = require("../../common/constants/permission-grid.constants");
const role_dto_1 = require("../../dtos/common/role.dto");
let RolesService = class RolesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const roles = await this.prisma.role.findMany({
            orderBy: { name: "asc" },
        });
        return roles.map((role) => this.toRoleDto(role));
    }
    async getPermissionGrid(roleName) {
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role ${roleName} not found`);
        }
        const stored = role.permissions;
        const merged = (0, permission_grid_constants_1.mergePermissionGrid)(roleName, stored);
        const summary = role_permissions_constants_1.ROLE_PERMISSIONS.find((entry) => entry.name === roleName);
        return {
            roleId: role.uid,
            role: roleName,
            description: summary?.description ?? role.description ?? "",
            groups: permission_grid_constants_1.PERMISSION_GROUPS.map((group) => ({
                key: group.key,
                label: group.label,
                resources: group.resources.map((resource) => ({
                    key: resource.key,
                    label: resource.label,
                    permissions: Object.fromEntries(permission_grid_constants_1.PERMISSION_ACTIONS.map((action) => [
                        action.key,
                        merged[resource.key]?.[action.key] ?? false,
                    ])),
                })),
            })),
        };
    }
    async updatePermissionGrid(roleName, dto) {
        if (roleName === role_dto_1.RoleName.ADMIN) {
            throw new common_1.BadRequestException("Admin permissions cannot be modified");
        }
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role ${roleName} not found`);
        }
        const merged = (0, permission_grid_constants_1.mergePermissionGrid)(roleName, dto.permissions);
        await this.prisma.role.update({
            where: { uid: role.uid },
            data: {
                permissions: merged,
            },
        });
        return this.getPermissionGrid(roleName);
    }
    toRoleDto(role) {
        const roleName = role.name;
        const summary = role_permissions_constants_1.ROLE_PERMISSIONS.find((entry) => entry.name === roleName);
        const stored = role.permissions;
        const merged = (0, permission_grid_constants_1.mergePermissionGrid)(roleName, stored);
        return {
            id: role.uid,
            name: roleName,
            description: summary?.description ?? role.description ?? "",
            permissions: (0, permission_grid_constants_1.flattenPermissionGrid)(merged),
        };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map