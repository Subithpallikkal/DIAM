import { ApiProperty } from "@nestjs/swagger";
import { RoleName } from "../common/role.dto";

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  uid!: number;

  @ApiProperty({ example: "Admin" })
  name!: string;

  @ApiProperty({ example: "admin@gmail.com" })
  email!: string;

  @ApiProperty({ enum: RoleName, example: RoleName.ADMIN })
  role!: RoleName;
}

export class LoginResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken!: string;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}

export class MeResponseDto {
  @ApiProperty({ example: 1 })
  uid!: number;

  @ApiProperty({ example: "Admin" })
  name!: string;

  @ApiProperty({ example: "admin@gmail.com" })
  email!: string;

  @ApiProperty({ enum: RoleName, example: RoleName.ADMIN })
  role!: RoleName;
}
