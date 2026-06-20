import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { EngagementStatus } from "../common/engagement.dto";

export class CreateEngagementDto {
  @ApiProperty({ example: 1, description: "Client uid" })
  @IsInt()
  @Type(() => Number)
  clientId!: number;

  @ApiProperty({ example: "Financial Audit 2026" })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({ example: "Financial" })
  @IsString()
  @MinLength(1)
  auditType!: string;

  @ApiPropertyOptional({ example: "2025-26" })
  @IsOptional()
  @IsString()
  financialYear?: string;

  @ApiPropertyOptional({ example: "2026-04-01" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: "2026-06-30" })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: EngagementStatus, example: EngagementStatus.DRAFT })
  @IsOptional()
  @IsEnum(EngagementStatus)
  status?: EngagementStatus;

  @ApiPropertyOptional({ example: "Annual statutory audit" })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateEngagementDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  clientId?: number;

  @ApiPropertyOptional({ example: "Financial Audit 2026" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: "Financial" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  auditType?: string;

  @ApiPropertyOptional({ example: "2025-26" })
  @IsOptional()
  @IsString()
  financialYear?: string;

  @ApiPropertyOptional({ example: "2026-04-01" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: "2026-06-30" })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: EngagementStatus })
  @IsOptional()
  @IsEnum(EngagementStatus)
  status?: EngagementStatus;

  @ApiPropertyOptional({ example: "Fieldwork started on revenue testing" })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpsertEngagementDto extends UpdateEngagementDto {
  @ApiPropertyOptional({ example: 1, description: "When set, updates the existing engagement" })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}

export class EngagementListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  clientId!: number;

  @ApiProperty({ example: "ABC Pvt Ltd" })
  clientName!: string;

  @ApiProperty({ example: "Financial Audit 2026" })
  title!: string;

  @ApiProperty({ example: "Financial" })
  auditType!: string;

  @ApiProperty({ example: "2025-26", nullable: true })
  financialYear!: string | null;

  @ApiProperty({ enum: EngagementStatus, example: EngagementStatus.DRAFT })
  status!: string;

  @ApiProperty({ example: "2026-04-01T00:00:00.000Z", nullable: true })
  startDate!: Date | null;

  @ApiProperty({ example: "2026-06-30T00:00:00.000Z", nullable: true })
  endDate!: Date | null;

  @ApiProperty({ example: "2026-06-13T07:18:47.000Z" })
  createdAt!: Date;
}

export class EngagementDetailDto extends EngagementListItemDto {
  @ApiProperty({ example: "Annual statutory audit", nullable: true })
  description!: string | null;

  @ApiProperty({ example: "2026-06-13T07:18:47.000Z" })
  updatedAt!: Date;
}

export class CreateScopeDto {
  @ApiProperty({ example: "Sales" })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: "Review sales invoices and revenue recognition" })
  @IsOptional()
  @IsString()
  description?: string;
}

export class ScopeListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Sales" })
  name!: string;

  @ApiProperty({ example: "Review sales invoices", nullable: true })
  description!: string | null;

  @ApiProperty({ example: true })
  isActive!: boolean;
}

export class CreateRequiredDocumentDto {
  @ApiProperty({ example: "Bank Statement" })
  @IsString()
  @MinLength(1)
  documentName!: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}

export class UpdateRequiredDocumentDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isReceived?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}

export class UpsertRequiredDocumentDto extends UpdateRequiredDocumentDto {
  @ApiPropertyOptional({ example: 1, description: "When set, updates the existing checklist item" })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ example: "Bank Statement" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  documentName?: string;
}

export class RequiredDocumentListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Bank Statement" })
  documentName!: string;

  @ApiProperty({ example: true })
  isRequired!: boolean;

  @ApiProperty({ example: false })
  isReceived!: boolean;
}
