"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
const enums_dto_1 = require("../../dtos/common/enums.dto");
let IssuesService = class IssuesService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async findAll(query, filters) {
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
        const where = {
            engagementUid: filters?.engagementId,
            status: filters?.status ?? query.status,
            ...(query.severity ? { severity: query.severity } : {}),
            ...(query.search?.trim()
                ? {
                    OR: [
                        { title: { contains: query.search.trim(), mode: "insensitive" } },
                        { description: { contains: query.search.trim(), mode: "insensitive" } },
                    ],
                }
                : {}),
        };
        const [issues, total] = await Promise.all([
            this.prisma.issue.findMany({
                where,
                include: {
                    engagement: true,
                    _count: { select: { findings: true } },
                },
                orderBy: this.buildOrderBy(query),
                skip,
                take,
            }),
            this.prisma.issue.count({ where }),
        ]);
        return (0, pagination_util_1.buildPaginatedResponse)(issues.map((issue) => this.toListItem(issue)), total, page, limit);
    }
    buildOrderBy(query) {
        const direction = (0, pagination_util_1.resolveSortDirection)(query);
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
    async findOne(id) {
        const issue = await this.prisma.issue.findUnique({
            where: { uid: id },
            include: {
                engagement: true,
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
            throw new common_1.NotFoundException(`Issue ${id} not found`);
        }
        return this.toDetail(issue);
    }
    async create(engagementId, dto, createdByUid) {
        await this.ensureEngagementExists(engagementId);
        const issue = await this.prisma.issue.create({
            data: {
                engagementUid: engagementId,
                title: dto.title,
                description: dto.description,
                severity: dto.severity ?? enums_dto_1.Priority.MEDIUM,
                responsiblePerson: dto.responsiblePerson,
                createdByUid,
            },
            include: { engagement: true, findings: true },
        });
        await this.prisma.issueStatusLog.create({
            data: {
                issueUid: issue.uid,
                oldStatus: enums_dto_1.IssueStatus.OPEN,
                newStatus: enums_dto_1.IssueStatus.OPEN,
                changedByUid: createdByUid,
            },
        });
        return this.toListItem(issue);
    }
    async upsert(engagementId, dto, changedByUid) {
        const { id, ...data } = dto;
        if (id != null) {
            await this.ensureBelongsToEngagement(id, engagementId);
            return this.update(id, data, changedByUid);
        }
        if (!data.title?.trim()) {
            throw new common_1.BadRequestException("title is required");
        }
        return this.create(engagementId, data, changedByUid);
    }
    async update(id, dto, changedByUid) {
        const existing = await this.prisma.issue.findUnique({ where: { uid: id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Issue ${id} not found`);
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
    async assign(issueId, dto, assignedByUid) {
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
    async addFinding(issueId, dto, createdByUid) {
        await this.ensureExists(issueId);
        const finding = await this.prisma.finding.create({
            data: {
                issueUid: issueId,
                title: dto.title,
                description: dto.description,
                severity: dto.severity ?? enums_dto_1.Priority.MEDIUM,
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
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.issue.delete({ where: { uid: id } });
    }
    async ensureExists(id) {
        const issue = await this.prisma.issue.findUnique({ where: { uid: id } });
        if (!issue) {
            throw new common_1.NotFoundException(`Issue ${id} not found`);
        }
    }
    async ensureBelongsToEngagement(issueId, engagementId) {
        const issue = await this.prisma.issue.findFirst({
            where: { uid: issueId, engagementUid: engagementId },
        });
        if (!issue) {
            throw new common_1.NotFoundException(`Issue ${issueId} not found for engagement ${engagementId}`);
        }
    }
    async ensureEngagementExists(engagementId) {
        const engagement = await this.prisma.auditEngagement.findUnique({
            where: { uid: engagementId },
        });
        if (!engagement) {
            throw new common_1.NotFoundException(`Engagement ${engagementId} not found`);
        }
    }
    async ensureUserExists(userId) {
        const user = await this.prisma.user.findUnique({ where: { uid: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
    }
    toListItem(issue) {
        return {
            id: issue.uid,
            engagementId: issue.engagementUid,
            engagementTitle: issue.engagement.title,
            title: issue.title,
            severity: issue.severity,
            status: issue.status,
            responsiblePerson: issue.responsiblePerson,
            findingsCount: issue._count?.findings ?? issue.findings?.length ?? 0,
            createdAt: issue.createdAt,
        };
    }
    toDetail(issue) {
        return {
            ...this.toListItem({ ...issue, findings: issue.findings }),
            description: issue.description,
            assigneeName: issue.assignments?.[0]?.assignedTo.name ?? null,
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
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], IssuesService);
//# sourceMappingURL=issues.service.js.map