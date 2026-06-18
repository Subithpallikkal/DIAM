import { IssueStatus, Priority } from "../common/enums.dto";
export declare class CreateIssueDto {
    title: string;
    description?: string;
    severity?: Priority;
    responsiblePerson?: string;
}
export declare class UpdateIssueDto {
    title?: string;
    description?: string;
    severity?: Priority;
    status?: IssueStatus;
    responsiblePerson?: string;
}
export declare class AssignIssueDto {
    assignedToId: number;
}
export declare class CreateFindingDto {
    title: string;
    description?: string;
    severity?: Priority;
}
export declare class IssueListItemDto {
    id: number;
    engagementId: number;
    engagementTitle: string;
    title: string;
    severity: string;
    status: string;
    responsiblePerson: string | null;
    findingsCount: number;
    createdAt: Date;
}
export declare class FindingDto {
    id: number;
    title: string;
    description: string | null;
    severity: string;
    createdByName: string;
    createdAt: Date;
}
export declare class IssueStatusLogDto {
    id: number;
    oldStatus: string;
    newStatus: string;
    changedByName: string;
    createdAt: Date;
}
export declare class IssueDetailDto extends IssueListItemDto {
    description: string | null;
    findings: FindingDto[];
    statusLogs: IssueStatusLogDto[];
    updatedAt: Date;
}
