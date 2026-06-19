import { RoleName } from "../common/role.dto";
export declare class RoleDto {
    id: number;
    name: RoleName;
    description: string;
    permissions: string[];
}
