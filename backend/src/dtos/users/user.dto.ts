import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { RoleName } from "../common/role.dto";

export class CreateUserDto {
  @ApiProperty({ example: "Jane Auditor" })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ example: "jane@company.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "SecurePass123" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: RoleName, example: RoleName.AUDITOR })
  @IsEnum(RoleName)
  role!: RoleName;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Jane Auditor" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ example: "jane@company.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "NewSecurePass123" })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ enum: RoleName, example: RoleName.MANAGER })
  @IsOptional()
  @IsEnum(RoleName)
  role?: RoleName;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Demo Admin" })
  name!: string;

  @ApiProperty({ example: "admin@demo.com" })
  email!: string;

  @ApiProperty({ enum: RoleName, example: RoleName.ADMIN })
  role!: RoleName;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: "2026-06-13T07:18:47.000Z" })
  createdAt!: Date;
}

export class UserDetailDto extends UserListItemDto {
  @ApiProperty({ example: "2026-06-13T07:18:47.000Z" })
  updatedAt!: Date;
}
