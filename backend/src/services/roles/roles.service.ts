import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { ROLE_PERMISSIONS } from "../../common/constants/role-permissions.constants";
import {
  flattenPermissionGrid,
  mergePermissionGrid,
  PERMISSION_ACTIONS,
  PERMISSION_GROUPS,
  type PermissionGridState,
} from "../../common/constants/permission-grid.constants";
import { RoleDto } from "../../dtos/roles/role.dto";
import {
  PermissionGridDto,
  UpdatePermissionGridDto,
} from "../../dtos/roles/permission-grid.dto";
import { RoleName } from "../../dtos/common/role.dto";

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<RoleDto[]> {
    const roles = await this.prisma.role.findMany({
      orderBy: { name: "asc" },
    });

    return roles.map((role) => this.toRoleDto(role));
  }

  async getPermissionGrid(roleName: RoleName): Promise<PermissionGridDto> {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    const stored = role.permissions as PermissionGridState | null;
    const merged = mergePermissionGrid(roleName, stored);
    const summary = ROLE_PERMISSIONS.find((entry) => entry.name === roleName);

    return {
      roleId: role.uid,
      role: roleName,
      description: summary?.description ?? role.description ?? "",
      groups: PERMISSION_GROUPS.map((group) => ({
        key: group.key,
        label: group.label,
        resources: group.resources.map((resource) => ({
          key: resource.key,
          label: resource.label,
          permissions: Object.fromEntries(
            PERMISSION_ACTIONS.map((action) => [
              action.key,
              merged[resource.key]?.[action.key] ?? false,
            ]),
          ),
        })),
      })),
    };
  }

  async updatePermissionGrid(
    roleName: RoleName,
    dto: UpdatePermissionGridDto,
  ): Promise<PermissionGridDto> {
    if (roleName === RoleName.ADMIN) {
      throw new BadRequestException("Admin permissions cannot be modified");
    }

    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    const merged = mergePermissionGrid(roleName, dto.permissions);

    await this.prisma.role.update({
      where: { uid: role.uid },
      data: {
        permissions: merged as Prisma.InputJsonValue,
      },
    });

    return this.getPermissionGrid(roleName);
  }

  private toRoleDto(role: {
    uid: number;
    name: string;
    description: string | null;
    permissions: Prisma.JsonValue | null;
  }): RoleDto {
    const roleName = role.name as RoleName;
    const summary = ROLE_PERMISSIONS.find((entry) => entry.name === roleName);
    const stored = role.permissions as PermissionGridState | null;
    const merged = mergePermissionGrid(roleName, stored);

    return {
      id: role.uid,
      name: roleName,
      description: summary?.description ?? role.description ?? "",
      permissions: flattenPermissionGrid(merged),
    };
  }
}
