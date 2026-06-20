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
  AssignIssueDto,
  AssignIssueClientDto,
  CreateFindingDto,
  CreateIssueDto,
  FindingDto,
  IssueDetailDto,
  IssueListItemDto,
  UpdateIssueDto,
  UpsertIssueDto,
} from "../../dtos/issues/issue.dto";
import { IssueStatus, Priority } from "../../dtos/common/enums.dto";

@Injectable()
export class IssuesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(
    query: PaginationQueryDto,
    filters?: {
      engagementId?: number;
      status?: string;
    },
  ): Promise<PaginatedResponseDto<IssueListItemDto>> {
    const { page, limit, skip, take } = resolvePagination(query);
    const where = {
      engagementUid: filters?.engagementId,
      status: filters?.status ?? query.status,
      ...(query.severity ? { severity: query.severity as Priority } : {}),
      ...(query.search?.trim()
        ? {
            OR: [
              { title: { contains: query.search.trim(), mode: "insensitive" as const } },
              { description: { contains: query.search.trim(), mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [issues, total] = await Promise.all([
      this.prisma.issue.findMany({
        where,
        include: {
          engagement: true,
          assignedClient: true,
          _count: { select: { findings: true } },
        },
        orderBy: this.buildOrderBy(query),
        skip,
        take,
      }),
      this.prisma.issue.count({ where }),
    ]);

    return buildPaginatedResponse(
      issues.map((issue) => this.toListItem(issue)),
      total,
      page,
      limit,
    );
  }

  private buildOrderBy(query: PaginationQueryDto): Prisma.IssueOrderByWithRelationInput {
    const direction = resolveSortDirection(query);

    switch (query.sortBy) {
      case "title":
        return { title: direction };
      case "engagementTitle":
        return { engagement: { title: direction } };
      case "severity":
        return { severity: direction };
      case "status":
        return { status: direction };
      case "createdAt":
        return { createdAt: direction };
      default:
        return { createdAt: "desc" };
    }
  }

  async findOne(id: number): Promise<IssueDetailDto> {
    const issue = await this.prisma.issue.findUnique({
      where: { uid: id },
      include: {
        engagement: true,
        assignedClient: true,
        findings: { include: { createdBy: true } },
        statusLogs: { include: { changedBy: true }, orderBy: { createdAt: "desc" } },
        assignments: {
          include: { assignedTo: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }

    return this.toDetail(issue);
  }

  async create(
    engagementId: number,
    dto: CreateIssueDto,
    createdByUid: number,
  ): Promise<IssueListItemDto> {
    await this.ensureEngagementExists(engagementId);

    const issue = await this.prisma.issue.create({
      data: {
        engagementUid: engagementId,
        title: dto.title,
        description: dto.description,
        severity: dto.severity ?? Priority.MEDIUM,
        responsiblePerson: dto.responsiblePerson,
        createdByUid,
      },
      include: { engagement: true, findings: true },
    });

    await this.prisma.issueStatusLog.create({
      data: {
        issueUid: issue.uid,
        oldStatus: IssueStatus.OPEN,
        newStatus: IssueStatus.OPEN,
        changedByUid: createdByUid,
      },
    });

    return this.toListItem(issue);
  }

  async upsert(
    engagementId: number,
    dto: UpsertIssueDto,
    changedByUid: number,
  ): Promise<IssueDetailDto | IssueListItemDto> {
    const { id, ...data } = dto;
    if (id != null) {
      await this.ensureBelongsToEngagement(id, engagementId);
      return this.update(id, data, changedByUid);
    }
    if (!data.title?.trim()) {
      throw new BadRequestException("title is required");
    }
    return this.create(engagementId, data as CreateIssueDto, changedByUid);
  }

  async update(
    id: number,
    dto: UpdateIssueDto,
    changedByUid: number,
  ): Promise<IssueDetailDto> {
    const existing = await this.prisma.issue.findUnique({ where: { uid: id } });
    if (!existing) {
      throw new NotFoundException(`Issue ${id} not found`);
    }

    if (dto.status && dto.status !== existing.status) {
      await this.prisma.issueStatusLog.create({
        data: {
          issueUid: id,
          oldStatus: existing.status,
          newStatus: dto.status,
          changedByUid,
        },
      });
    }

    await this.prisma.issue.update({
      where: { uid: id },
      data: dto,
    });

    return this.findOne(id);
  }

  async assign(
    issueId: number,
    dto: AssignIssueDto,
    assignedByUid: number,
  ): Promise<IssueDetailDto> {
    await this.ensureExists(issueId);
    await this.ensureUserExists(dto.assignedToId);

    await this.prisma.issueAssignment.create({
      data: {
        issueUid: issueId,
        assignedToUid: dto.assignedToId,
        assignedByUid,
      },
    });

    return this.findOne(issueId);
  }

  async assignClient(
    issueId: number,
    dto: AssignIssueClientDto,
  ): Promise<IssueDetailDto> {
    await this.ensureExists(issueId);
    await this.ensureClientExists(dto.clientId);

    await this.prisma.issue.update({
      where: { uid: issueId },
      data: { assignedClientUid: dto.clientId },
    });

    return this.findOne(issueId);
  }

  async addFinding(
    issueId: number,
    dto: CreateFindingDto,
    createdByUid: number,
  ): Promise<FindingDto> {
    await this.ensureExists(issueId);

    const finding = await this.prisma.finding.create({
      data: {
        issueUid: issueId,
        title: dto.title,
        description: dto.description,
        severity: dto.severity ?? Priority.MEDIUM,
        createdByUid,
      },
      include: { createdBy: true },
    });

    return {
      id: finding.uid,
      title: finding.title,
      description: finding.description,
      severity: finding.severity,
      createdByName: finding.createdBy.name,
      createdAt: finding.createdAt,
    };
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.issue.delete({ where: { uid: id } });
  }

  async ensureExists(id: number) {
    const issue = await this.prisma.issue.findUnique({ where: { uid: id } });
    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }
  }

  private async ensureBelongsToEngagement(issueId: number, engagementId: number) {
    const issue = await this.prisma.issue.findFirst({
      where: { uid: issueId, engagementUid: engagementId },
    });
    if (!issue) {
      throw new NotFoundException(
        `Issue ${issueId} not found for engagement ${engagementId}`,
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

  private async ensureUserExists(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { uid: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
  }

  private async ensureClientExists(clientId: number) {
    const client = await this.prisma.client.findUnique({ where: { uid: clientId } });
    if (!client) {
      throw new NotFoundException(`Client ${clientId} not found`);
    }
  }

  private toListItem(issue: {
    uid: number;
    engagementUid: number;
    title: string;
    severity: string;
    status: string;
    responsiblePerson: string | null;
    createdAt: Date;
    engagement: { title: string };
    assignedClient?: { name: string } | null;
    findings?: unknown[];
    _count?: { findings: number };
  }): IssueListItemDto {
    return {
      id: issue.uid,
      engagementId: issue.engagementUid,
      engagementTitle: issue.engagement.title,
      title: issue.title,
      severity: issue.severity,
      status: issue.status,
      responsiblePerson: issue.responsiblePerson,
      assignedClientName: issue.assignedClient?.name ?? null,
      findingsCount: issue._count?.findings ?? issue.findings?.length ?? 0,
      createdAt: issue.createdAt,
    };
  }

  private toDetail(issue: {
    uid: number;
    engagementUid: number;
    title: string;
    description: string | null;
    severity: string;
    status: string;
    responsiblePerson: string | null;
    createdAt: Date;
    updatedAt: Date;
    engagement: { title: string };
    assignedClient?: { uid: number; name: string } | null;
    findings: {
      uid: number;
      title: string;
      description: string | null;
      severity: string;
      createdAt: Date;
      createdBy: { name: string };
    }[];
    statusLogs: {
      uid: number;
      oldStatus: string;
      newStatus: string;
      createdAt: Date;
      changedBy: { name: string };
    }[];
    assignments?: {
      assignedTo: { name: string };
    }[];
  }): IssueDetailDto {
    return {
      ...this.toListItem({ ...issue, findings: issue.findings }),
      description: issue.description,
      assigneeName: issue.assignments?.[0]?.assignedTo.name ?? null,
      assignedClientId: issue.assignedClient?.uid ?? null,
      updatedAt: issue.updatedAt,
      findings: issue.findings.map((finding) => ({
        id: finding.uid,
        title: finding.title,
        description: finding.description,
        severity: finding.severity,
        createdByName: finding.createdBy.name,
        createdAt: finding.createdAt,
      })),
      statusLogs: issue.statusLogs.map((log) => ({
        id: log.uid,
        oldStatus: log.oldStatus,
        newStatus: log.newStatus,
        changedByName: log.changedBy.name,
        createdAt: log.createdAt,
      })),
    };
  }
}
