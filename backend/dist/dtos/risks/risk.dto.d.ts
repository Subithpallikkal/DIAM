import { Priority, RiskStatus } from "../common/enums.dto";
export declare class CreateRiskDto {
    title: string;
    description?: string;
    priority?: Priority;
    status?: RiskStatus;
}
export declare class UpdateRiskDto {
    title?: string;
    description?: string;
    priority?: Priority;
    status?: RiskStatus;
}
export declare class RiskListItemDto {
    id: number;
    engagementId: number;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    checklistCount: number;
    completedChecklistCount: number;
    createdAt: Date;
}
export declare class CreateChecklistItemDto {
    title: string;
    sortOrder?: number;
}
export declare class UpdateChecklistItemDto {
    title?: string;
    isCompleted?: boolean;
    sortOrder?: number;
}
export declare class ChecklistItemDto {
    id: number;
    title: string;
    isCompleted: boolean;
    sortOrder: number;
    assigneeName: string | null;
}
export declare class AssignChecklistDto {
    assignedToId: number;
}
