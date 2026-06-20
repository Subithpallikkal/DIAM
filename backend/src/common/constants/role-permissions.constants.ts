import { RoleName } from "../../dtos/common/role.dto";

export interface RolePermissionDefinition {
  name: RoleName;
  description: string;
  permissions: string[];
}

export const ROLE_PERMISSIONS: RolePermissionDefinition[] = [
  {
    name: RoleName.ADMIN,
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
    name: RoleName.MANAGER,
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
    name: RoleName.AUDITOR,
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
