import { RolesService } from "../../services/roles/roles.service";
import { RoleDto } from "../../dtos/roles/role.dto";
import { PermissionGridDto, UpdatePermissionGridDto } from "../../dtos/roles/permission-grid.dto";
import { RoleName } from "../../dtos/common/role.dto";
export declare class RolesController {
    private rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<RoleDto[]>;
    getPermissionGrid(role: RoleName): Promise<PermissionGridDto>;
    updatePermissionGrid(role: RoleName, dto: UpdatePermissionGridDto): Promise<PermissionGridDto>;
}
