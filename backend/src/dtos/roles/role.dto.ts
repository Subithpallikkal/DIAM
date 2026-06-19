import { ApiProperty } from "@nestjs/swagger";
import { RoleName } from "../common/role.dto";

export class RoleDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ enum: RoleName, example: RoleName.ADMIN })
  name!: RoleName;

  @ApiProperty({ example: "Full system access" })
  description!: string;

  @ApiProperty({
    example: ["Create, update, and deactivate users", "Manage clients and engagements"],
    type: [String],
  })
  permissions!: string[];
}
