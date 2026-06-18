import { RoleName } from "../common/role.dto";
export declare class AuthUserDto {
    uid: number;
    name: string;
    email: string;
    role: RoleName;
}
export declare class LoginResponseDto {
    accessToken: string;
    user: AuthUserDto;
}
export declare class MeResponseDto {
    uid: number;
    name: string;
    email: string;
    role: RoleName;
}
