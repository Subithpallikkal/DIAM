import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import {
  buildPaginatedResponse,
  resolvePagination,
  resolveSortDirection,
} from "../../common/prisma/pagination.util";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import {
  ClientDetailDto,
  ClientListItemDto,
  CreateClientDto,
  UpdateClientDto,
  UpsertClientDto,
} from "../../dtos/clients/client.dto";

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async create(
    dto: CreateClientDto,
    createdByUid: number,
  ): Promise<ClientDetailDto> {
    const client = await this.prisma.client.create({
      data: {
        ...dto,
        createdByUid,
      },
    });

    this.cache.invalidatePrefix("dashboard:");
    return this.toDetail(client);
  }

  async upsert(
    dto: UpsertClientDto,
    createdByUid: number,
  ): Promise<ClientDetailDto> {
    const { id, ...data } = dto;
    if (id != null) {
      return this.update(id, data);
    }
    if (!data.name?.trim()) {
      throw new BadRequestException("name is required");
    }
    return this.create(data as CreateClientDto, createdByUid);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ClientListItemDto>> {
    const { page, limit, skip, take } = resolvePagination(query);
    const where = this.buildWhere(query);

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        orderBy: this.buildOrderBy(query),
        skip,
        take,
      }),
      this.prisma.client.count({ where }),
    ]);

    return buildPaginatedResponse(
      clients.map((client) => this.toListItem(client)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: number): Promise<ClientDetailDto> {
    const client = await this.prisma.client.findUnique({
      where: { uid: id },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    return this.toDetail(client);
  }

  async update(id: number, dto: UpdateClientDto): Promise<ClientDetailDto> {
    await this.ensureExists(id);

    const client = await this.prisma.client.update({
      where: { uid: id },
      data: dto,
    });

    this.cache.invalidatePrefix("dashboard:");
    return this.toDetail(client);
  }

  async deactivate(id: number): Promise<ClientDetailDto> {
    await this.ensureExists(id);

    const client = await this.prisma.client.update({
      where: { uid: id },
      data: { isActive: false },
    });

    this.cache.invalidatePrefix("dashboard:");
    return this.toDetail(client);
  }

  private buildWhere(query: PaginationQueryDto): Prisma.ClientWhereInput {
    const where: Prisma.ClientWhereInput = {};

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { email: { contains: term, mode: "insensitive" } },
        { phone: { contains: term, mode: "insensitive" } },
        { gstNumber: { contains: term, mode: "insensitive" } },
      ];
    }

    return where;
  }

  private buildOrderBy(query: PaginationQueryDto): Prisma.ClientOrderByWithRelationInput {
    const direction = resolveSortDirection(query);

    switch (query.sortBy) {
      case "name":
        return { name: direction };
      case "email":
        return { email: direction };
      case "phone":
        return { phone: direction };
      case "gstNumber":
        return { gstNumber: direction };
      case "isActive":
        return { isActive: direction };
      case "createdAt":
        return { createdAt: direction };
      default:
        return { createdAt: "desc" };
    }
  }

  private async ensureExists(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { uid: id },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }
  }

  private toListItem(client: {
    uid: number;
    name: string;
    email: string | null;
    phone: string | null;
    gstNumber: string | null;
    isActive: boolean;
    createdAt: Date;
  }): ClientListItemDto {
    return {
      id: client.uid,
      name: client.name,
      email: client.email,
      phone: client.phone,
      gstNumber: client.gstNumber,
      isActive: client.isActive,
      createdAt: client.createdAt,
    };
  }

  private toDetail(client: {
    uid: number;
    name: string;
    code: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    gstNumber: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ClientDetailDto {
    return {
      ...this.toListItem(client),
      code: client.code,
      address: client.address,
      updatedAt: client.updatedAt,
    };
  }
}
