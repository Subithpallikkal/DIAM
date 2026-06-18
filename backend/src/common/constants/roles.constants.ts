import { RoleName } from "../../dtos/common/role.dto";

export const Roles = {
  ALL: [RoleName.ADMIN, RoleName.MANAGER, RoleName.AUDITOR],
  ADMIN_MANAGER: [RoleName.ADMIN, RoleName.MANAGER],
  ADMIN_ONLY: [RoleName.ADMIN],
} as const;
