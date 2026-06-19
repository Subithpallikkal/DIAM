import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import {
  buildPaginatedResponse,
  resolvePagination,
  resolveSortDirection,
} from "../../common/prisma/pagination.util";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDetailDto,
  UserListItemDto,
} from "../../dtos/users/user.dto";
import { RoleName } from "../../dtos/common/role.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDetailDto> {
    const role = await this.prisma.role.findUnique({ where: { name: dto.role } });
    if (!role) {
      throw new NotFoundException(`Role ${dto.role} not found`);
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException("Email already in use");
    }

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password,
        roleUid: role.uid,
      },
      include: { role: true },
    });

    return this.toDetail(user);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserListItemDto>> {
    const { page, limit, skip, take } = resolvePagination(query);
    const where = this.buildWhere(query);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { role: true },
        orderBy: this.buildOrderBy(query),
        skip,
        take,
      }),
      this.prisma.user.count({ where }),
    ]);

    return buildPaginatedResponse(
      users.map((user) => this.toListItem(user)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: number): Promise<UserDetailDto> {
    const user = await this.prisma.user.findUnique({
      where: { uid: id },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.toDetail(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserDetailDto> {
    await this.ensureExists(id);

    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { uid: id },
        },
      });
      if (existing) {
        throw new ConflictException("Email already in use");
      }
    }

    let roleUid: number | undefined;
    if (dto.role) {
      const role = await this.prisma.role.findUnique({ where: { name: dto.role } });
      if (!role) {
        throw new NotFoundException(`Role ${dto.role} not found`);
      }
      roleUid = role.uid;
    }

    const data: Prisma.UserUpdateInput = {
      name: dto.name,
      email: dto.email,
      isActive: dto.isActive,
      ...(roleUid ? { role: { connect: { uid: roleUid } } } : {}),
      ...(dto.password ? { password: await bcrypt.hash(dto.password, 10) } : {}),
    };

    const user = await this.prisma.user.update({
      where: { uid: id },
      data,
      include: { role: true },
    });

    return this.toDetail(user);
  }

  async deactivate(id: number, currentUserId: number): Promise<UserDetailDto> {
    if (id === currentUserId) {
      throw new BadRequestException("You cannot deactivate your own account");
    }

    await this.ensureExists(id);

    const user = await this.prisma.user.update({
      where: { uid: id },
      data: { isActive: false },
      include: { role: true },
    });

    return this.toDetail(user);
  }

  private buildWhere(query: PaginationQueryDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.role) {
      where.role = { name: query.role as RoleName };
    }

    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    return where;
  }

  private buildOrderBy(query: PaginationQueryDto): Prisma.UserOrderByWithRelationInput {
    const direction = resolveSortDirection(query);

    switch (query.sortBy) {
      case "name":
        return { name: direction };
      case "email":
        return { email: direction };
      case "role":
        return { role: { name: direction } };
      case "isActive":
        return { isActive: direction };
      case "createdAt":
        return { createdAt: direction };
      default:
        return { createdAt: "desc" };
    }
  }

  private async ensureExists(id: number) {
    const user = await this.prisma.user.findUnique({ where: { uid: id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  private toListItem(user: {
    uid: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    role: { name: string };
  }): UserListItemDto {
    return {
      id: user.uid,
      name: user.name,
      email: user.email,
      role: user.role.name as RoleName,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  private toDetail(user: {
    uid: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: { name: string };
  }): UserDetailDto {
    return {
      ...this.toListItem(user),
      updatedAt: user.updatedAt,
    };
  }
}
