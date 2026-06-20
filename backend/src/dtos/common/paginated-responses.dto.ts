import { ApiProperty } from "@nestjs/swagger";
import { ClientListItemDto } from "../clients/client.dto";
import { DocumentListItemDto } from "../documents/document.dto";
import { EngagementListItemDto } from "../engagements/engagement.dto";
import { IssueListItemDto } from "../issues/issue.dto";
import { RiskListItemDto } from "../risks/risk.dto";
import { TaskListItemDto } from "../tasks/task.dto";
import { UserListItemDto } from "../users/user.dto";
import { PaginatedMetaDto } from "./pagination.dto";

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserListItemDto] })
  data!: UserListItemDto[];

  @ApiProperty({ type: PaginatedMetaDto })
  meta!: PaginatedMetaDto;
}

export class PaginatedClientsResponseDto {
  @ApiProperty({ type: [ClientListItemDto] })
  data!: ClientListItemDto[];

  @ApiProperty({ type: PaginatedMetaDto })
  meta!: PaginatedMetaDto;
}

export class PaginatedEngagementsResponseDto {
  @ApiProperty({ type: [EngagementListItemDto] })
  data!: EngagementListItemDto[];

  @ApiProperty({ type: PaginatedMetaDto })
  meta!: PaginatedMetaDto;
}

export class PaginatedIssuesResponseDto {
  @ApiProperty({ type: [IssueListItemDto] })
  data!: IssueListItemDto[];

  @ApiProperty({ type: PaginatedMetaDto })
  meta!: PaginatedMetaDto;
}

export class PaginatedTasksResponseDto {
  @ApiProperty({ type: [TaskListItemDto] })
  data!: TaskListItemDto[];

  @ApiProperty({ type: PaginatedMetaDto })
  meta!: PaginatedMetaDto;
}

export class PaginatedRisksResponseDto {
  @ApiProperty({ type: [RiskListItemDto] })
  data!: RiskListItemDto[];

  @ApiProperty({ type: PaginatedMetaDto })
  meta!: PaginatedMetaDto;
}

export class PaginatedDocumentsResponseDto {
  @ApiProperty({ type: [DocumentListItemDto] })
  data!: DocumentListItemDto[];

  @ApiProperty({ type: PaginatedMetaDto })
  meta!: PaginatedMetaDto;
}
