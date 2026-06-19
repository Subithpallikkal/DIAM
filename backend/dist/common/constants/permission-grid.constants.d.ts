import { RoleName } from "../../dtos/common/role.dto";
export declare const PERMISSION_ACTIONS: readonly [{
    readonly key: "create";
    readonly label: "Create";
}, {
    readonly key: "editOwn";
    readonly label: "Edit own";
}, {
    readonly key: "editAny";
    readonly label: "Edit any";
}, {
    readonly key: "deleteOwn";
    readonly label: "Delete own";
}, {
    readonly key: "deleteAny";
    readonly label: "Delete any";
}];
export type PermissionActionKey = (typeof PERMISSION_ACTIONS)[number]["key"];
export type ResourcePermissionState = Record<PermissionActionKey, boolean>;
export type PermissionGridState = Record<string, Partial<ResourcePermissionState>>;
export interface PermissionResourceDefinition {
    key: string;
    label: string;
}
export interface PermissionGroupDefinition {
    key: string;
    label: string;
    resources: PermissionResourceDefinition[];
}
export declare const PERMISSION_GROUPS: PermissionGroupDefinition[];
export declare function getAllResourceKeys(): string[];
export declare function getDefaultPermissionGrid(role: RoleName): PermissionGridState;
export declare function mergePermissionGrid(role: RoleName, stored?: PermissionGridState | null): PermissionGridState;
export declare function flattenPermissionGrid(grid: PermissionGridState): string[];
