import { UsersService } from "../../services/users/users.service";
import { UpsertUserDto, UserDetailDto, UserListItemDto } from "../../dtos/users/user.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    upsert(dto: UpsertUserDto): Promise<UserDetailDto>;
    findAll(query: PaginationQueryDto): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<UserListItemDto>>;
    findOne(id: number): Promise<UserDetailDto>;
    deactivate(id: number, user: JwtPayload): Promise<UserDetailDto>;
}
