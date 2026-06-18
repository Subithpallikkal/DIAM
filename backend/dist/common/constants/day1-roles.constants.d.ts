import { RoleName } from "../../dtos/common/role.dto";
export declare const Roles: {
    readonly ALL: readonly [RoleName.ADMIN, RoleName.MANAGER, RoleName.AUDITOR];
    readonly ADMIN_MANAGER: readonly [RoleName.ADMIN, RoleName.MANAGER];
    readonly ADMIN_ONLY: readonly [RoleName.ADMIN];
};
