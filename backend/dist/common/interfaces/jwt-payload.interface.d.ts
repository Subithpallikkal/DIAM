import { RoleName } from "../../dtos/common/role.dto";
export interface JwtPayload {
    sub: number;
    email: string;
    role: RoleName;
}
