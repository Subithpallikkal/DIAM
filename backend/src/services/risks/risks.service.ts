import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import {
  buildPaginatedResponse,
  resolvePagination,
  resolveSortDirection,
} from "../../common/prisma/pagination.util";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import {
  AssignChecklistDto,
  ChecklistItemDto,
  CreateChecklistItemDto,
  CreateRiskDto,
  RiskListItemDto,
  UpdateChecklistItemDto,
  UpdateRiskDto,
  UpsertChecklistItemDto,
  UpsertRiskDto,
} from "../../dtos/risks/risk.dto";
import { Priority, RiskStatus } from "../../dtos/common/enums.dto";

@Injectable()
export class RisksService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(
    query: PaginationQueryDto,
    engagementId?: number,
  ): Promise<PaginatedResponseDto<RiskListItemDto>> {
    const { page, limit, skip, take } = resolvePagination(query);
    const where = {
      engagementUid: engagementId,
      ...(query.status ? { status: query.status as RiskStatus } : {}),
      ...(query.priority ? { priority: query.priority as Priority } : {}),
      ...(query.search?.trim()
        ? {
            OR: [
              { title: { contains: query.search.trim(), mode: "insensitive" as const } },
              { description: { contains: query.search.trim(), mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [risks, total] = await Promise.all([
      this.prisma.risk.findMany({
        where,
        include: {
          checklists: { select: { isCompleted: true } },
        },
        orderBy: this.buildOrderBy(query),
        skip,
        take,
      }),
      this.prisma.risk.count({ where }),
    ]);

    return buildPaginatedResponse(
      risks.map((risk) => this.toListItem(risk)),
      total,
      page,
      limit,
    );
  }

  private buildOrderBy(query: PaginationQueryDto): Prisma.RiskOrderByWithRelationInput {
    const direction = resolveSortDirection(query);

    switch (query.sortBy) {
      case "title":
        return { title: direction };
      case "priority":
        return { priority: direction };
      case "status":
        return { status: direction };
      case "createdAt":
        return { createdAt: direction };
      default:
        return { createdAt: "desc" };
    }
  }

  async findOne(id: number): Promise<RiskListItemDto> {
    const risk = await this.prisma.risk.findUnique({
      where: { uid: id },
      include: { checklists: true },
    });

    if (!risk) {
      throw new NotFoundException(`Risk ${id} not found`);
    }

    return this.toListItem(risk);
  }

  async create(
    engagementId: number,
    dto: CreateRiskDto,
    createdByUid: number,
  ): Promise<RiskListItemDto> {
    await this.ensureEngagementExists(engagementId);

    const risk = await this.prisma.risk.create({
      data: {
        engagementUid: engagementId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority ?? Priority.MEDIUM,
        status: dto.status ?? RiskStatus.OPEN,
        createdByUid,
      },
      include: { checklists: true },
    });

    return this.toListItem(risk);
  }

  async upsert(
    engagementId: number,
    dto: UpsertRiskDto,
    createdByUid: number,
  ): Promise<RiskListItemDto> {
    const { id, ...data } = dto;
    if (id != null) {
      await this.ensureBelongsToEngagement(id, engagementId);
      return this.update(id, data);
    }
    if (!data.title?.trim()) {
      throw new BadRequestException("title is required");
    }
    return this.create(engagementId, data as CreateRiskDto, createdByUid);
  }

  async update(id: number, dto: UpdateRiskDto): Promise<RiskListItemDto> {
    await this.ensureExists(id);

    const risk = await this.prisma.risk.update({
      where: { uid: id },
      data: dto,
      include: { checklists: true },
    });

    return this.toListItem(risk);
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.risk.delete({ where: { uid: id } });
  }

  async findChecklists(riskId: number): Promise<ChecklistItemDto[]> {
    await this.ensureExists(riskId);

    const items = await this.prisma.riskChecklist.findMany({
      where: { riskUid: riskId },
      include: {
        assignments: {
          include: { assignedTo: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { uid: "asc" }],
    });

    return items.map((item) => ({
      id: item.uid,
      title: item.title,
      isCompleted: item.isCompleted,
      sortOrder: item.sortOrder,
      assigneeName: item.assignments[0]?.assignedTo.name ?? null,
    }));
  }

  async addChecklistItem(
    riskId: number,
    dto: CreateChecklistItemDto,
  ): Promise<ChecklistItemDto> {
    await this.ensureExists(riskId);

    const item = await this.prisma.riskChecklist.create({
      data: {
        riskUid: riskId,
        title: dto.title,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    return {
      id: item.uid,
      title: item.title,
      isCompleted: item.isCompleted,
      sortOrder: item.sortOrder,
      assigneeName: null,
    };
  }

  async upsertChecklistItem(
    riskId: number,
    dto: UpsertChecklistItemDto,
  ): Promise<ChecklistItemDto> {
    const { id, ...data } = dto;
    if (id != null) {
      return this.updateChecklistItem(riskId, id, data);
    }
    if (!data.title?.trim()) {
      throw new BadRequestException("title is required");
    }
    return this.addChecklistItem(riskId, data as CreateChecklistItemDto);
  }

  async updateChecklistItem(
    riskId: number,
    checklistId: number,
    dto: UpdateChecklistItemDto,
  ): Promise<ChecklistItemDto> {
    await this.ensureChecklistBelongsToRisk(riskId, checklistId);

    const item = await this.prisma.riskChecklist.update({
      where: { uid: checklistId },
      data: dto,
      include: {
        assignments: {
          include: { assignedTo: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return {
      id: item.uid,
      title: item.title,
      isCompleted: item.isCompleted,
      sortOrder: item.sortOrder,
      assigneeName: item.assignments[0]?.assignedTo.name ?? null,
    };
  }

  async assignChecklistItem(
    riskId: number,
    checklistId: number,
    dto: AssignChecklistDto,
    assignedByUid: number,
  ): Promise<ChecklistItemDto> {
    await this.ensureChecklistBelongsToRisk(riskId, checklistId);
    await this.ensureUserExists(dto.assignedToId);

    await this.prisma.checklistAssignment.create({
      data: {
        checklistUid: checklistId,
        assignedToUid: dto.assignedToId,
        assignedByUid,
      },
    });

    return this.updateChecklistItem(riskId, checklistId, {});
  }

  async ensureExists(id: number) {
    const risk = await this.prisma.risk.findUnique({ where: { uid: id } });
    if (!risk) {
      throw new NotFoundException(`Risk ${id} not found`);
    }
  }

  private async ensureBelongsToEngagement(riskId: number, engagementId: number) {
    const risk = await this.prisma.risk.findFirst({
      where: { uid: riskId, engagementUid: engagementId },
    });
    if (!risk) {
      throw new NotFoundException(
        `Risk ${riskId} not found for engagement ${engagementId}`,
      );
    }
  }

  private async ensureEngagementExists(engagementId: number) {
    const engagement = await this.prisma.auditEngagement.findUnique({
      where: { uid: engagementId },
    });
    if (!engagement) {
      throw new NotFoundException(`Engagement ${engagementId} not found`);
    }
  }

  private async ensureChecklistBelongsToRisk(riskId: number, checklistId: number) {
    const item = await this.prisma.riskChecklist.findFirst({
      where: { uid: checklistId, riskUid: riskId },
    });
    if (!item) {
      throw new NotFoundException(`Checklist item ${checklistId} not found`);
    }
  }

  private async ensureUserExists(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { uid: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
  }

  private toListItem(risk: {
    uid: number;
    engagementUid: number;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    createdAt: Date;
    checklists: { isCompleted: boolean }[];
  }): RiskListItemDto {
    return {
      id: risk.uid,
      engagementId: risk.engagementUid,
      title: risk.title,
      description: risk.description,
      priority: risk.priority,
      status: risk.status,
      checklistCount: risk.checklists.length,
      completedChecklistCount: risk.checklists.filter((item) => item.isCompleted).length,
      createdAt: risk.createdAt,
    };
  }
}
