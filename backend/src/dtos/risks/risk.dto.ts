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
  priority?: Priority;

  @ApiPropertyOptional({ enum: RiskStatus })
  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;
}

export class RiskListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  engagementId!: number;

  @ApiProperty({ example: "Cash handling control weak" })
  title!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ enum: Priority })
  priority!: string;

  @ApiProperty({ enum: RiskStatus })
  status!: string;

  @ApiProperty({ example: 3 })
  checklistCount!: number;

  @ApiProperty({ example: 1 })
  completedChecklistCount!: number;

  @ApiProperty()
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
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;
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

  @ApiProperty({ nullable: true })
  assigneeName!: string | null;
}

export class AssignChecklistDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Type(() => Number)
  assignedToId!: number;
}
