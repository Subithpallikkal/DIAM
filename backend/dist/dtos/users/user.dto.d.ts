import { RoleName } from "../common/role.dto";
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: RoleName;
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: RoleName;
    isActive?: boolean;
}
export declare class UpsertUserDto extends UpdateUserDto {
    id?: number;
}
export declare class UserListItemDto {
    id: number;
    name: string;
    email: string;
    role: RoleName;
    isActive: boolean;
    createdAt: Date;
}
export declare class UserDetailDto extends UserListItemDto {
    updatedAt: Date;
}
