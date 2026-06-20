import { PrismaService } from "../../common/prisma/prisma.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { CreateUserDto, UpdateUserDto, UpsertUserDto, UserDetailDto, UserListItemDto } from "../../dtos/users/user.dto";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<UserDetailDto>;
    upsert(dto: UpsertUserDto): Promise<UserDetailDto>;
    findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<UserListItemDto>>;
    findOne(id: number): Promise<UserDetailDto>;
    update(id: number, dto: UpdateUserDto): Promise<UserDetailDto>;
    deactivate(id: number, currentUserId: number): Promise<UserDetailDto>;
    private buildWhere;
    private buildOrderBy;
    private ensureExists;
    private toListItem;
    private toDetail;
}
