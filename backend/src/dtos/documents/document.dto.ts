import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class CreateDocumentCategoryDto {
  @ApiProperty({ example: "Financial" })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: "Financial statements and records" })
  @IsOptional()
  @IsString()
  description?: string;
}

export class DocumentCategoryDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Financial" })
  name!: string;

  @ApiProperty({ example: "Financial statements", nullable: true })
  description!: string | null;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}

export class DocumentListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  clientId!: number;

  @ApiProperty({ example: "ABC Pvt Ltd" })
  clientName!: string;

  @ApiProperty({ example: 1, nullable: true })
  engagementId!: number | null;

  @ApiProperty({ example: "Financial Audit 2026", nullable: true })
  engagementTitle!: string | null;

  @ApiProperty({ example: 1, nullable: true })
  categoryId!: number | null;

  @ApiProperty({ example: "Financial", nullable: true })
  categoryName!: string | null;

  @ApiProperty({ example: "Bank Statement.pdf" })
  originalName!: string;

  @ApiProperty({ example: "application/pdf" })
  mimeType!: string;

  @ApiProperty({ example: 102400 })
  fileSize!: number;

  @ApiProperty({ example: "Demo Auditor" })
  uploadedByName!: string;

  @ApiProperty({ example: 1 })
  version!: number;

  @ApiProperty({ example: 1, nullable: true })
  parentDocumentId!: number | null;

  @ApiProperty({ example: 1 })
  rootDocumentId!: number;

  @ApiProperty({ example: 1 })
  versionCount!: number;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}

export class DocumentLogDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "DOWNLOAD" })
  action!: string;

  @ApiProperty({ example: "Auditor" })
  performedByName!: string;

  @ApiProperty({ example: "Downloaded for review", nullable: true })
  details!: string | null;

  @ApiProperty({ example: "2026-06-19T10:00:00.000Z" })
  createdAt!: Date;
}
