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
exports.RisksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
const enums_dto_1 = require("../../dtos/common/enums.dto");
let RisksService = class RisksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query, engagementId) {
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
        const where = {
            engagementUid: engagementId,
            ...(query.status ? { status: query.status } : {}),
            ...(query.priority ? { priority: query.priority } : {}),
            ...(query.search?.trim()
                ? {
                    OR: [
                        { title: { contains: query.search.trim(), mode: "insensitive" } },
                        { description: { contains: query.search.trim(), mode: "insensitive" } },
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
        return (0, pagination_util_1.buildPaginatedResponse)(risks.map((risk) => this.toListItem(risk)), total, page, limit);
    }
    buildOrderBy(query) {
        const direction = (0, pagination_util_1.resolveSortDirection)(query);
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
    async findOne(id) {
        const risk = await this.prisma.risk.findUnique({
            where: { uid: id },
            include: { checklists: true },
        });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk ${id} not found`);
        }
        return this.toListItem(risk);
    }
    async create(engagementId, dto, createdByUid) {
        await this.ensureEngagementExists(engagementId);
        const risk = await this.prisma.risk.create({
            data: {
                engagementUid: engagementId,
                title: dto.title,
                description: dto.description,
                priority: dto.priority ?? enums_dto_1.Priority.MEDIUM,
                status: dto.status ?? enums_dto_1.RiskStatus.OPEN,
                createdByUid,
            },
            include: { checklists: true },
        });
        return this.toListItem(risk);
    }
    async upsert(engagementId, dto, createdByUid) {
        const { id, ...data } = dto;
        if (id != null) {
            await this.ensureBelongsToEngagement(id, engagementId);
            return this.update(id, data);
        }
        if (!data.title?.trim()) {
            throw new common_1.BadRequestException("title is required");
        }
        return this.create(engagementId, data, createdByUid);
    }
    async update(id, dto) {
        await this.ensureExists(id);
        const risk = await this.prisma.risk.update({
            where: { uid: id },
            data: dto,
            include: { checklists: true },
        });
        return this.toListItem(risk);
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.risk.delete({ where: { uid: id } });
    }
    async findChecklists(riskId) {
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
    async addChecklistItem(riskId, dto) {
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
    async upsertChecklistItem(riskId, dto) {
        const { id, ...data } = dto;
        if (id != null) {
            return this.updateChecklistItem(riskId, id, data);
        }
        if (!data.title?.trim()) {
            throw new common_1.BadRequestException("title is required");
        }
        return this.addChecklistItem(riskId, data);
    }
    async updateChecklistItem(riskId, checklistId, dto) {
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
    async assignChecklistItem(riskId, checklistId, dto, assignedByUid) {
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
    async ensureExists(id) {
        const risk = await this.prisma.risk.findUnique({ where: { uid: id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk ${id} not found`);
        }
    }
    async ensureBelongsToEngagement(riskId, engagementId) {
        const risk = await this.prisma.risk.findFirst({
            where: { uid: riskId, engagementUid: engagementId },
        });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk ${riskId} not found for engagement ${engagementId}`);
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
    async ensureChecklistBelongsToRisk(riskId, checklistId) {
        const item = await this.prisma.riskChecklist.findFirst({
            where: { uid: checklistId, riskUid: riskId },
        });
        if (!item) {
            throw new common_1.NotFoundException(`Checklist item ${checklistId} not found`);
        }
    }
    async ensureUserExists(userId) {
        const user = await this.prisma.user.findUnique({ where: { uid: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
    }
    toListItem(risk) {
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
};
exports.RisksService = RisksService;
exports.RisksService = RisksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RisksService);
//# sourceMappingURL=risks.service.js.map