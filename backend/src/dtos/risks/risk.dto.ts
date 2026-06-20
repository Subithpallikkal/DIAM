import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Priority, RiskStatus } from "../common/enums.dto";

export class CreateRiskDto {
  @ApiProperty({ example: "Cash handling control weak" })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional({ example: "No dual approval for cash disbursements" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Priority, example: Priority.HIGH })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ enum: RiskStatus, example: RiskStatus.OPEN })
  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;
}

export class UpdateRiskDto {
  @ApiPropertyOptional({ example: "Revenue recognition cutoff errors" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: "Q4 sales may be recorded in wrong period" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Priority, example: Priority.HIGH })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ enum: RiskStatus, example: RiskStatus.OPEN })
  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;
}

export class UpsertRiskDto extends UpdateRiskDto {
  @ApiPropertyOptional({ example: 1, description: "When set, updates the existing risk" })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}

export class RiskListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  engagementId!: number;

  @ApiProperty({ example: "Cash handling control weak" })
  title!: string;

  @ApiProperty({ example: "Q4 sales may be recorded in wrong period", nullable: true })
  description!: string | null;

  @ApiProperty({ enum: Priority, example: Priority.HIGH })
  priority!: string;

  @ApiProperty({ enum: RiskStatus, example: RiskStatus.OPEN })
  status!: string;

  @ApiProperty({ example: 3 })
  checklistCount!: number;

  @ApiProperty({ example: 1 })
  completedChecklistCount!: number;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}

export class CreateChecklistItemDto {
  @ApiProperty({ example: "Verify cash register" })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateChecklistItemDto {
  @ApiPropertyOptional({ example: "Review Q4 sales invoices" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;
}

export class UpsertChecklistItemDto extends UpdateChecklistItemDto {
  @ApiPropertyOptional({ example: 1, description: "When set, updates the existing checklist item" })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}

export class ChecklistItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Verify cash register" })
  title!: string;

  @ApiProperty({ example: false })
  isCompleted!: boolean;

  @ApiProperty({ example: 0 })
  sortOrder!: number;

  @ApiProperty({ example: "Auditor", nullable: true })
  assigneeName!: string | null;
}

export class AssignChecklistDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Type(() => Number)
  assignedToId!: number;
}
