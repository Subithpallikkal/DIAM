import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { TaskStatus } from "../common/enums.dto";

export class CreateTaskDto {
  @ApiProperty({ example: "Risk Review - Cash Controls" })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional({ example: "Review cash handling risks for Q1" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: "Perform revenue substantive testing" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: "Sample 25 invoices across Q3 and Q4" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export class UpsertTaskDto extends UpdateTaskDto {
  @ApiPropertyOptional({ example: 1, description: "When set, updates the existing task" })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}

export class AssignTaskDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Type(() => Number)
  assignedToId!: number;
}

export class CreateTaskCommentDto {
  @ApiProperty({ example: "Started reviewing cash vouchers" })
  @IsString()
  @MinLength(1)
  content!: string;
}

export class TaskListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  engagementId!: number;

  @ApiProperty({ example: "Financial Audit 2026" })
  engagementTitle!: string;

  @ApiProperty({ example: "Risk Review" })
  title!: string;

  @ApiProperty({ example: "Sample 25 invoices across Q3 and Q4", nullable: true })
  description!: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  status!: string;

  @ApiProperty({ example: "Auditor", nullable: true })
  assigneeName!: string | null;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}

export class TaskCommentDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Auditor" })
  authorName!: string;

  @ApiProperty({ example: "Started reviewing Q4 sales invoices" })
  content!: string;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}

export class TaskDetailDto extends TaskListItemDto {
  @ApiProperty({ type: [TaskCommentDto] })
  comments!: TaskCommentDto[];

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  updatedAt!: Date;
}
