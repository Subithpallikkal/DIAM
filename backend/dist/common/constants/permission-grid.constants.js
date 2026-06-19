"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_GROUPS = exports.PERMISSION_ACTIONS = void 0;
exports.getAllResourceKeys = getAllResourceKeys;
exports.getDefaultPermissionGrid = getDefaultPermissionGrid;
exports.mergePermissionGrid = mergePermissionGrid;
exports.flattenPermissionGrid = flattenPermissionGrid;
const role_dto_1 = require("../../dtos/common/role.dto");
exports.PERMISSION_ACTIONS = [
    { key: "create", label: "Create" },
    { key: "editOwn", label: "Edit own" },
    { key: "editAny", label: "Edit any" },
    { key: "deleteOwn", label: "Delete own" },
    { key: "deleteAny", label: "Delete any" },
];
exports.PERMISSION_GROUPS = [
    {
        key: "audit",
        label: "Audit modules",
        resources: [
            { key: "users", label: "Users" },
            { key: "clients", label: "Clients" },
            { key: "engagements", label: "Engagements" },
            { key: "documents", label: "Documents" },
            { key: "risks", label: "Risks" },
            { key: "tasks", label: "Tasks" },
            { key: "issues", label: "Issues" },
        ],
    },
    {
        key: "system",
        label: "System",
        resources: [
            { key: "reports", label: "Reports" },
            { key: "roles", label: "Roles & permissions" },
        ],
    },
];
const ALL_ACTIONS = [
    "create",
    "editOwn",
    "editAny",
    "deleteOwn",
    "deleteAny",
];
function resourcePermissions(values) {
    return {
        create: values.create ?? false,
        editOwn: values.editOwn ?? false,
        editAny: values.editAny ?? false,
        deleteOwn: values.deleteOwn ?? false,
        deleteAny: values.deleteAny ?? false,
    };
}
function fullAccess() {
    return resourcePermissions({
        create: true,
        editOwn: true,
        editAny: true,
        deleteOwn: true,
        deleteAny: true,
    });
}
function none() {
    return resourcePermissions({});
}
function manage() {
    return resourcePermissions({
        create: true,
        editOwn: true,
        editAny: true,
        deleteOwn: false,
        deleteAny: false,
    });
}
function contribute() {
    return resourcePermissions({
        create: false,
        editOwn: true,
        editAny: false,
        deleteOwn: false,
        deleteAny: false,
    });
}
function viewExport() {
    return resourcePermissions({
        create: false,
        editOwn: false,
        editAny: true,
        deleteOwn: false,
        deleteAny: false,
    });
}
const DEFAULT_ROLE_GRIDS = {
    [role_dto_1.RoleName.ADMIN]: Object.fromEntries(exports.PERMISSION_GROUPS.flatMap((group) => group.resources.map((resource) => [resource.key, fullAccess()]))),
    [role_dto_1.RoleName.MANAGER]: {
        users: viewExport(),
        clients: resourcePermissions({
            create: true,
            editOwn: true,
            editAny: true,
        }),
        engagements: manage(),
        documents: resourcePermissions({
            create: true,
            editOwn: true,
            editAny: true,
            deleteAny: true,
        }),
        risks: manage(),
        tasks: manage(),
        issues: manage(),
        reports: viewExport(),
        roles: viewExport(),
    },
    [role_dto_1.RoleName.AUDITOR]: {
        users: none(),
        clients: viewExport(),
        engagements: viewExport(),
        documents: viewExport(),
        risks: contribute(),
        tasks: contribute(),
        issues: contribute(),
        reports: viewExport(),
        roles: none(),
    },
};
function getAllResourceKeys() {
    return exports.PERMISSION_GROUPS.flatMap((group) => group.resources.map((resource) => resource.key));
}
function getDefaultPermissionGrid(role) {
    const defaults = DEFAULT_ROLE_GRIDS[role];
    const merged = {};
    for (const resourceKey of getAllResourceKeys()) {
        merged[resourceKey] = resourcePermissions(defaults[resourceKey] ?? {});
    }
    return merged;
}
function mergePermissionGrid(role, stored) {
    const defaults = getDefaultPermissionGrid(role);
    if (!stored)
        return defaults;
    const merged = { ...defaults };
    for (const resourceKey of getAllResourceKeys()) {
        merged[resourceKey] = resourcePermissions({
            ...defaults[resourceKey],
            ...stored[resourceKey],
        });
    }
    return merged;
}
function flattenPermissionGrid(grid) {
    const labels = [];
    for (const group of exports.PERMISSION_GROUPS) {
        for (const resource of group.resources) {
            const state = grid[resource.key];
            if (!state)
                continue;
            for (const action of ALL_ACTIONS) {
                if (state[action]) {
                    const actionLabel = exports.PERMISSION_ACTIONS.find((entry) => entry.key === action)?.label ??
                        action;
                    labels.push(`${actionLabel} ${resource.label}`);
                }
            }
        }
    }
    return labels;
}
//# sourceMappingURL=permission-grid.constants.js.map