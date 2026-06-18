"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const role_dto_1 = require("../../dtos/common/role.dto");
exports.Roles = {
    ALL: [role_dto_1.RoleName.ADMIN, role_dto_1.RoleName.MANAGER, role_dto_1.RoleName.AUDITOR],
    ADMIN_MANAGER: [role_dto_1.RoleName.ADMIN, role_dto_1.RoleName.MANAGER],
    ADMIN_ONLY: [role_dto_1.RoleName.ADMIN],
};
//# sourceMappingURL=roles.constants.js.map