import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";
import { RoleName } from "../common/role.dto";
import type { PermissionGridState } from "../../common/constants/permission-grid.constants";

export class PermissionResourceDto {
  @ApiProperty({ example: "clients" })
  key!: string;

  @ApiProperty({ example: "Clients" })
  label!: string;

  @ApiProperty({
    example: {
      create: true,
      editOwn: true,
      editAny: true,
      deleteOwn: false,
      deleteAny: false,
    },
  })
  permissions!: Record<string, boolean>;
}

export class PermissionGroupDto {
  @ApiProperty({ example: "audit" })
  key!: string;

  @ApiProperty({ example: "Audit modules" })
  label!: string;

  @ApiProperty({ type: [PermissionResourceDto] })
  resources!: PermissionResourceDto[];
}

export class PermissionGridDto {
  @ApiProperty({ example: 1 })
  roleId!: number;

  @ApiProperty({ enum: RoleName, example: RoleName.MANAGER })
  role!: RoleName;

  @ApiProperty({ example: "Manage clients and audit engagements" })
  description!: string;

  @ApiProperty({ type: [PermissionGroupDto] })
  groups!: PermissionGroupDto[];
}

export class UpdatePermissionGridDto {
  @ApiProperty({
    example: {
      clients: { create: true, editAny: true },
    },
  })
  @IsObject()
  permissions!: PermissionGridState;
}
