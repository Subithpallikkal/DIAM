import { RoleName } from "../common/role.dto";
export declare class UserListItemDto {
    uid: number;
    name: string;
    email: string;
    role: RoleName;
    isActive: boolean;
    createdAt: Date;
}
