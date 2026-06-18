import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import {
  buildPaginatedResponse,
  resolvePagination,
} from "../../common/prisma/pagination.util";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { UserListItemDto } from "../../dtos/users/user-list-item.dto";
import { RoleName } from "../../dtos/common/role.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserListItemDto>> {
    const { page, limit, skip, take } = resolvePagination(query);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        include: { role: true },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.user.count(),
    ]);

    return buildPaginatedResponse(
      users.map((user) => ({
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role.name as RoleName,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })),
      total,
      page,
      limit,
    );
  }
}
