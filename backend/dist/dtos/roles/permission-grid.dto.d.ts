import { RoleName } from "../common/role.dto";
import type { PermissionGridState } from "../../common/constants/permission-grid.constants";
export declare class PermissionResourceDto {
    key: string;
    label: string;
    permissions: Record<string, boolean>;
}
export declare class PermissionGroupDto {
    key: string;
    label: string;
    resources: PermissionResourceDto[];
}
export declare class PermissionGridDto {
    roleId: number;
    role: RoleName;
    description: string;
    groups: PermissionGroupDto[];
}
export declare class UpdatePermissionGridDto {
    permissions: PermissionGridState;
}
