import { RoleName } from "../../dtos/common/role.dto";

export const PERMISSION_ACTIONS = [
  { key: "create", label: "Create" },
  { key: "editOwn", label: "Edit own" },
  { key: "editAny", label: "Edit any" },
  { key: "deleteOwn", label: "Delete own" },
  { key: "deleteAny", label: "Delete any" },
] as const;

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

export const PERMISSION_GROUPS: PermissionGroupDefinition[] = [
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

const ALL_ACTIONS: PermissionActionKey[] = [
  "create",
  "editOwn",
  "editAny",
  "deleteOwn",
  "deleteAny",
];

function resourcePermissions(
  values: Partial<ResourcePermissionState>,
): ResourcePermissionState {
  return {
    create: values.create ?? false,
    editOwn: values.editOwn ?? false,
    editAny: values.editAny ?? false,
    deleteOwn: values.deleteOwn ?? false,
    deleteAny: values.deleteAny ?? false,
  };
}

function fullAccess(): ResourcePermissionState {
  return resourcePermissions({
    create: true,
    editOwn: true,
    editAny: true,
    deleteOwn: true,
    deleteAny: true,
  });
}

function none(): ResourcePermissionState {
  return resourcePermissions({});
}

function manage(): ResourcePermissionState {
  return resourcePermissions({
    create: true,
    editOwn: true,
    editAny: true,
    deleteOwn: false,
    deleteAny: false,
  });
}

function contribute(): ResourcePermissionState {
  return resourcePermissions({
    create: false,
    editOwn: true,
    editAny: false,
    deleteOwn: false,
    deleteAny: false,
  });
}

function viewExport(): ResourcePermissionState {
  return resourcePermissions({
    create: false,
    editOwn: false,
    editAny: true,
    deleteOwn: false,
    deleteAny: false,
  });
}

const DEFAULT_ROLE_GRIDS: Record<RoleName, PermissionGridState> = {
  [RoleName.ADMIN]: Object.fromEntries(
    PERMISSION_GROUPS.flatMap((group) =>
      group.resources.map((resource) => [resource.key, fullAccess()]),
    ),
  ),
  [RoleName.MANAGER]: {
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
  [RoleName.AUDITOR]: {
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

export function getAllResourceKeys(): string[] {
  return PERMISSION_GROUPS.flatMap((group) =>
    group.resources.map((resource) => resource.key),
  );
}

export function getDefaultPermissionGrid(role: RoleName): PermissionGridState {
  const defaults = DEFAULT_ROLE_GRIDS[role];
  const merged: PermissionGridState = {};

  for (const resourceKey of getAllResourceKeys()) {
    merged[resourceKey] = resourcePermissions(defaults[resourceKey] ?? {});
  }

  return merged;
}

export function mergePermissionGrid(
  role: RoleName,
  stored?: PermissionGridState | null,
): PermissionGridState {
  const defaults = getDefaultPermissionGrid(role);
  if (!stored) return defaults;

  const merged: PermissionGridState = { ...defaults };

  for (const resourceKey of getAllResourceKeys()) {
    merged[resourceKey] = resourcePermissions({
      ...defaults[resourceKey],
      ...stored[resourceKey],
    });
  }

  return merged;
}

export function flattenPermissionGrid(
  grid: PermissionGridState,
): string[] {
  const labels: string[] = [];

  for (const group of PERMISSION_GROUPS) {
    for (const resource of group.resources) {
      const state = grid[resource.key];
      if (!state) continue;

      for (const action of ALL_ACTIONS) {
        if (state[action]) {
          const actionLabel =
            PERMISSION_ACTIONS.find((entry) => entry.key === action)?.label ??
            action;
          labels.push(`${actionLabel} ${resource.label}`);
        }
      }
    }
  }

  return labels;
}
