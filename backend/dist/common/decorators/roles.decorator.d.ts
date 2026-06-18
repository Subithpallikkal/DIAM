import { RoleName } from "../../dtos/common/role.dto";
export declare const ROLES_KEY = "roles";
export declare const RequireRoles: (...roles: RoleName[]) => import("@nestjs/common").CustomDecorator<string>;
