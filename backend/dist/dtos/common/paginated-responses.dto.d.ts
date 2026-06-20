import { ClientListItemDto } from "../clients/client.dto";
import { DocumentListItemDto } from "../documents/document.dto";
import { EngagementListItemDto } from "../engagements/engagement.dto";
import { IssueListItemDto } from "../issues/issue.dto";
import { RiskListItemDto } from "../risks/risk.dto";
import { TaskListItemDto } from "../tasks/task.dto";
import { UserListItemDto } from "../users/user.dto";
import { PaginatedMetaDto } from "./pagination.dto";
export declare class PaginatedUsersResponseDto {
    data: UserListItemDto[];
    meta: PaginatedMetaDto;
}
export declare class PaginatedClientsResponseDto {
    data: ClientListItemDto[];
    meta: PaginatedMetaDto;
}
export declare class PaginatedEngagementsResponseDto {
    data: EngagementListItemDto[];
    meta: PaginatedMetaDto;
}
export declare class PaginatedIssuesResponseDto {
    data: IssueListItemDto[];
    meta: PaginatedMetaDto;
}
export declare class PaginatedTasksResponseDto {
    data: TaskListItemDto[];
    meta: PaginatedMetaDto;
}
export declare class PaginatedRisksResponseDto {
    data: RiskListItemDto[];
    meta: PaginatedMetaDto;
}
export declare class PaginatedDocumentsResponseDto {
    data: DocumentListItemDto[];
    meta: PaginatedMetaDto;
}
