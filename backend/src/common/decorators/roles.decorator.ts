import { SetMetadata } from "@nestjs/common";
import { RoleName } from "../../dtos/common/role.dto";

export const ROLES_KEY = "roles";
export const RequireRoles = (...roles: RoleName[]) =>
  SetMetadata(ROLES_KEY, roles);
