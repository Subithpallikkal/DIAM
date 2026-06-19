"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = void 0;
exports.getRolePermissions = getRolePermissions;
const role_dto_1 = require("../../dtos/common/role.dto");
exports.ROLE_PERMISSIONS = [
    {
        name: role_dto_1.RoleName.ADMIN,
        description: "Full system access",
        permissions: [
            "Create, update, and deactivate users",
            "Assign roles to users",
            "Create, update, and deactivate clients",
            "Manage audit engagements and scopes",
            "Upload and delete documents",
            "Manage risks, tasks, and issues",
            "View and export all reports",
        ],
    },
    {
        name: role_dto_1.RoleName.MANAGER,
        description: "Manage clients and audit engagements",
        permissions: [
            "View users list",
            "Create and update clients",
            "Manage audit engagements, scopes, and required documents",
            "Upload and delete documents",
            "Create and manage risks, tasks, and issues",
            "Assign tasks and issues to team members",
            "View and export all reports",
        ],
    },
    {
        name: role_dto_1.RoleName.AUDITOR,
        description: "Execute audit work and review documents",
        permissions: [
            "View clients, engagements, and documents",
            "Download and view documents",
            "View risks and update assigned checklists",
            "View tasks, add comments, and update assigned work",
            "View issues and add findings",
            "View and export reports",
        ],
    },
];
function getRolePermissions(role) {
    const match = exports.ROLE_PERMISSIONS.find((entry) => entry.name === role);
    if (!match) {
        throw new Error(`Unknown role: ${role}`);
    }
    return match;
}
//# sourceMappingURL=role-permissions.constants.js.map