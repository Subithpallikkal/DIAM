import { UsersService } from "../../services/users/users.service";
import { UserListItemDto } from "../../dtos/users/user-list-item.dto";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(query: PaginationQueryDto): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<UserListItemDto>>;
}
