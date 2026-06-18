import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { UserListItemDto } from "../../dtos/users/user-list-item.dto";
export declare class UsersService {
    private prisma;
    private cache;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<UserListItemDto>>;
}
