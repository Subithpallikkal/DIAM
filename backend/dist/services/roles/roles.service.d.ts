import { PrismaService } from "../../common/prisma/prisma.service";
import { RoleDto } from "../../dtos/roles/role.dto";
import { PermissionGridDto, UpdatePermissionGridDto } from "../../dtos/roles/permission-grid.dto";
import { RoleName } from "../../dtos/common/role.dto";
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<RoleDto[]>;
    getPermissionGrid(roleName: RoleName): Promise<PermissionGridDto>;
    updatePermissionGrid(roleName: RoleName, dto: UpdatePermissionGridDto): Promise<PermissionGridDto>;
    private toRoleDto;
}
