import { ApiProperty } from "@nestjs/swagger";
import { RoleName } from "../common/role.dto";

export class UserListItemDto {
  @ApiProperty({ example: 1 })
  uid!: number;

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
