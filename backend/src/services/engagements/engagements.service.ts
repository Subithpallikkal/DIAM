import { Injectable, NotFoundException } from "@nestjs/common";
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
  CreateEngagementDto,
  EngagementDetailDto,
  EngagementListItemDto,
  UpdateEngagementDto,
} from "../../dtos/engagements/engagement.dto";
import { EngagementStatus } from "../../dtos/common/engagement.dto";

@Injectable()
export class EngagementsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async create(
    dto: CreateEngagementDto,
    createdByUid: number,
  ): Promise<EngagementDetailDto> {
    await this.ensureClientExists(dto.clientId);

    const engagement = await this.prisma.auditEngagement.create({
      data: {
        clientUid: dto.clientId,
        title: dto.title,
        auditType: dto.auditType,
        financialYear: dto.financialYear,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status ?? EngagementStatus.DRAFT,
        description: dto.description,
        createdByUid,
      },
      include: { client: true },
    });

    return this.toDetail(engagement);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<EngagementListItemDto>> {
    const { page, limit, skip, take } = resolvePagination(query);
    const where = this.buildWhere(query);

    const [engagements, total] = await Promise.all([
      this.prisma.auditEngagement.findMany({
        where,
        include: { client: true },
        orderBy: this.buildOrderBy(query),
        skip,
        take,
      }),
      this.prisma.auditEngagement.count({ where }),
    ]);

    return buildPaginatedResponse(
      engagements.map((engagement) => this.toListItem(engagement)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: number): Promise<EngagementDetailDto> {
    const engagement = await this.prisma.auditEngagement.findUnique({
      where: { uid: id },
      include: { client: true },
    });

    if (!engagement) {
      throw new NotFoundException(`Engagement ${id} not found`);
    }

    return this.toDetail(engagement);
  }

  async update(
    id: number,
    dto: UpdateEngagementDto,
  ): Promise<EngagementDetailDto> {
    await this.ensureExists(id);

    if (dto.clientId) {
      await this.ensureClientExists(dto.clientId);
    }

    const engagement = await this.prisma.auditEngagement.update({
      where: { uid: id },
      data: {
        clientUid: dto.clientId,
        title: dto.title,
        auditType: dto.auditType,
        financialYear: dto.financialYear,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status,
        description: dto.description,
      },
      include: { client: true },
    });

    return this.toDetail(engagement);
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.auditEngagement.delete({ where: { uid: id } });
    this.cache.invalidatePrefix("dashboard:");
  }

  private buildWhere(query: PaginationQueryDto): Prisma.AuditEngagementWhereInput {
    const where: Prisma.AuditEngagementWhereInput = {};

    if (query.status) {
      where.status = query.status as EngagementStatus;
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { auditType: { contains: term, mode: "insensitive" } },
        { client: { name: { contains: term, mode: "insensitive" } } },
      ];
    }

    return where;
  }

  private buildOrderBy(
    query: PaginationQueryDto,
  ): Prisma.AuditEngagementOrderByWithRelationInput {
    const direction = resolveSortDirection(query);

    switch (query.sortBy) {
      case "title":
        return { title: direction };
      case "clientName":
        return { client: { name: direction } };
      case "auditType":
        return { auditType: direction };
      case "financialYear":
        return { financialYear: direction };
      case "status":
        return { status: direction };
      case "createdAt":
        return { createdAt: direction };
      default:
        return { createdAt: "desc" };
    }
  }

  async ensureExists(id: number) {
    const engagement = await this.prisma.auditEngagement.findUnique({
      where: { uid: id },
    });

    if (!engagement) {
      throw new NotFoundException(`Engagement ${id} not found`);
    }
  }

  private async ensureClientExists(clientId: number) {
    const client = await this.prisma.client.findUnique({
      where: { uid: clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client ${clientId} not found`);
    }
  }

  private toListItem(engagement: {
    uid: number;
    clientUid: number;
    title: string;
    auditType: string;
    financialYear: string | null;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    client: { name: string };
  }): EngagementListItemDto {
    return {
      id: engagement.uid,
      clientId: engagement.clientUid,
      clientName: engagement.client.name,
      title: engagement.title,
      auditType: engagement.auditType,
      financialYear: engagement.financialYear,
      status: engagement.status,
      startDate: engagement.startDate,
      endDate: engagement.endDate,
      createdAt: engagement.createdAt,
    };
  }

  private toDetail(engagement: {
    uid: number;
    clientUid: number;
    title: string;
    auditType: string;
    financialYear: string | null;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    client: { name: string };
  }): EngagementDetailDto {
    return {
      ...this.toListItem(engagement),
      description: engagement.description,
      updatedAt: engagement.updatedAt,
    };
  }
}
