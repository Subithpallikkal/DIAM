import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateClientDto {
  @ApiProperty({ example: "ABC Pvt Ltd" })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: "ABC001" })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: "contact@abc.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+91-9876543210" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "123 Business Park, Mumbai" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: "27AABCU9603R1ZM" })
  @IsOptional()
  @IsString()
  gstNumber?: string;
}

export class UpdateClientDto {
  @ApiPropertyOptional({ example: "ABC Pvt Ltd" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ example: "ABC001" })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: "contact@abc.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+91-9876543210" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "123 Business Park, Mumbai" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: "27AABCU9603R1ZM" })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ClientListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "ABC Pvt Ltd" })
  name!: string;

  @ApiProperty({ example: "contact@abc.com", nullable: true })
  email!: string | null;

  @ApiProperty({ example: "+91-9876543210", nullable: true })
  phone!: string | null;

  @ApiProperty({ example: "27AABCU9603R1ZM", nullable: true })
  gstNumber!: string | null;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: "2026-06-13T07:18:47.000Z" })
  createdAt!: Date;
}

export class ClientDetailDto extends ClientListItemDto {
  @ApiProperty({ example: "ABC001", nullable: true })
  code!: string | null;

  @ApiProperty({ example: "123 Business Park, Mumbai", nullable: true })
  address!: string | null;

  @ApiProperty({ example: "2026-06-13T07:18:47.000Z" })
  updatedAt!: Date;
}
