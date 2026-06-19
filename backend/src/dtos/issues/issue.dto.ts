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
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  severity?: Priority;

  @ApiPropertyOptional({ enum: IssueStatus })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiPropertyOptional()
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

export class CreateFindingDto {
  @ApiProperty({ example: "Missing input tax credit reconciliation" })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional()
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

  @ApiProperty({ enum: Priority })
  severity!: string;

  @ApiProperty({ enum: IssueStatus })
  status!: string;

  @ApiProperty({ nullable: true })
  responsiblePerson!: string | null;

  @ApiProperty({ example: 2 })
  findingsCount!: number;

  @ApiProperty()
  createdAt!: Date;
}

export class FindingDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ enum: Priority })
  severity!: string;

  @ApiProperty({ example: "Demo Auditor" })
  createdByName!: string;

  @ApiProperty()
  createdAt!: Date;
}

export class IssueStatusLogDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  oldStatus!: string;

  @ApiProperty()
  newStatus!: string;

  @ApiProperty()
  changedByName!: string;

  @ApiProperty()
  createdAt!: Date;
}

export class IssueDetailDto extends IssueListItemDto {
  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ example: "Demo Auditor", nullable: true })
  assigneeName!: string | null;

  @ApiProperty({ type: [FindingDto] })
  findings!: FindingDto[];

  @ApiProperty({ type: [IssueStatusLogDto] })
  statusLogs!: IssueStatusLogDto[];

  @ApiProperty()
  updatedAt!: Date;
}
