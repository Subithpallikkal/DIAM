import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { IssueStatus, Priority } from "../common/enums.dto";

export class CreateIssueDto {
  @ApiProperty({ example: "GST filing delayed" })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional({ example: "GSTR-3B not filed for March 2026" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Priority, example: Priority.HIGH })
  @IsOptional()
  @IsEnum(Priority)
  severity?: Priority;

  @ApiPropertyOptional({ example: "Finance Manager" })
  @IsOptional()
  @IsString()
  responsiblePerson?: string;
}

export class UpdateIssueDto {
  @ApiPropertyOptional({ example: "Unrecorded sales invoices in December" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: "Q4 invoices not posted to ERP" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Priority, example: Priority.HIGH })
  @IsOptional()
  @IsEnum(Priority)
  severity?: Priority;

  @ApiPropertyOptional({ enum: IssueStatus, example: IssueStatus.IN_PROGRESS })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiPropertyOptional({ example: "CFO — Acme Industries" })
  @IsOptional()
  @IsString()
  responsiblePerson?: string;
}

export class UpsertIssueDto extends UpdateIssueDto {
  @ApiPropertyOptional({ example: 1, description: "When set, updates the existing issue" })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}

export class AssignIssueDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Type(() => Number)
  assignedToId!: number;
}

export class AssignIssueClientDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Type(() => Number)
  clientId!: number;
}

export class CreateFindingDto {
  @ApiProperty({ example: "Missing input tax credit reconciliation" })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional({ example: "Invoices dated 28–31 Dec posted in January" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Priority, example: Priority.MEDIUM })
  @IsOptional()
  @IsEnum(Priority)
  severity?: Priority;
}

export class IssueListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  engagementId!: number;

  @ApiProperty({ example: "Financial Audit 2026" })
  engagementTitle!: string;

  @ApiProperty({ example: "GST filing delayed" })
  title!: string;

  @ApiProperty({ enum: Priority, example: Priority.HIGH })
  severity!: string;

  @ApiProperty({ enum: IssueStatus, example: IssueStatus.IN_PROGRESS })
  status!: string;

  @ApiProperty({ example: "CFO — Acme Industries", nullable: true })
  responsiblePerson!: string | null;

  @ApiProperty({ example: "ABC Pvt Ltd", nullable: true })
  assignedClientName!: string | null;

  @ApiProperty({ example: 2 })
  findingsCount!: number;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}

export class FindingDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "₹12.4L revenue not recorded in ERP" })
  title!: string;

  @ApiProperty({ example: "Invoices dated 28–31 Dec posted in January", nullable: true })
  description!: string | null;

  @ApiProperty({ enum: Priority, example: Priority.HIGH })
  severity!: string;

  @ApiProperty({ example: "Demo Auditor" })
  createdByName!: string;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}

export class IssueStatusLogDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ enum: IssueStatus, example: IssueStatus.OPEN })
  oldStatus!: string;

  @ApiProperty({ enum: IssueStatus, example: IssueStatus.IN_PROGRESS })
  newStatus!: string;

  @ApiProperty({ example: "Manager" })
  changedByName!: string;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}

export class IssueDetailDto extends IssueListItemDto {
  @ApiProperty({ example: "Q4 invoices not posted to ERP", nullable: true })
  description!: string | null;

  @ApiProperty({ example: "Demo Auditor", nullable: true })
  assigneeName!: string | null;

  @ApiProperty({ example: 2, nullable: true })
  assignedClientId!: number | null;

  @ApiProperty({ type: [FindingDto] })
  findings!: FindingDto[];

  @ApiProperty({ type: [IssueStatusLogDto] })
  statusLogs!: IssueStatusLogDto[];

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  updatedAt!: Date;
}
