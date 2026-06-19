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
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
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

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ enum: TaskStatus })
  status!: string;

  @ApiProperty({ nullable: true })
  assigneeName!: string | null;

  @ApiProperty()
  createdAt!: Date;
}

export class TaskCommentDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Demo Auditor" })
  authorName!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  createdAt!: Date;
}

export class TaskDetailDto extends TaskListItemDto {
  @ApiProperty({ type: [TaskCommentDto] })
  comments!: TaskCommentDto[];

  @ApiProperty()
  updatedAt!: Date;
}
