import { RoleName } from "../../dtos/common/role.dto";
export interface RolePermissionDefinition {
    name: RoleName;
    description: string;
    permissions: string[];
}
export declare const ROLE_PERMISSIONS: RolePermissionDefinition[];
