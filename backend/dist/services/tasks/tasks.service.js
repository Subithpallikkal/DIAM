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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
const enums_dto_1 = require("../../dtos/common/enums.dto");
let TasksService = class TasksService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async findAll(query, filters) {
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
        const where = {
            engagementUid: filters?.engagementId,
            status: filters?.status ?? query.status,
            assignments: filters?.assigneeId
                ? { some: { assignedToUid: filters.assigneeId } }
                : undefined,
            ...(query.search?.trim()
                ? {
                    OR: [
                        { title: { contains: query.search.trim(), mode: "insensitive" } },
                        { description: { contains: query.search.trim(), mode: "insensitive" } },
                    ],
                }
                : {}),
        };
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                include: {
                    engagement: true,
                    assignments: {
                        include: { assignedTo: true },
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
                orderBy: this.buildOrderBy(query),
                skip,
                take,
            }),
            this.prisma.task.count({ where }),
        ]);
        return (0, pagination_util_1.buildPaginatedResponse)(tasks.map((task) => this.toListItem(task)), total, page, limit);
    }
    buildOrderBy(query) {
        const direction = (0, pagination_util_1.resolveSortDirection)(query);
        switch (query.sortBy) {
            case "title":
                return { title: direction };
            case "engagementTitle":
                return { engagement: { title: direction } };
            case "status":
                return { status: direction };
            case "assigneeName":
                return { createdAt: direction };
            case "createdAt":
                return { createdAt: direction };
            default:
                return { createdAt: "desc" };
        }
    }
    async findOne(id) {
        const task = await this.prisma.task.findUnique({
            where: { uid: id },
            include: {
                engagement: true,
                assignments: {
                    include: { assignedTo: true },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
                comments: {
                    include: { user: true },
                    orderBy: { createdAt: "asc" },
                },
            },
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task ${id} not found`);
        }
        return this.toDetail(task);
    }
    async create(engagementId, dto, createdByUid) {
        await this.ensureEngagementExists(engagementId);
        const task = await this.prisma.task.create({
            data: {
                engagementUid: engagementId,
                title: dto.title,
                description: dto.description,
                status: dto.status ?? enums_dto_1.TaskStatus.PENDING,
                createdByUid,
            },
            include: {
                engagement: true,
                assignments: { include: { assignedTo: true }, take: 1 },
            },
        });
        return this.toListItem(task);
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
        const task = await this.prisma.task.update({
            where: { uid: id },
            data: dto,
            include: {
                engagement: true,
                assignments: {
                    include: { assignedTo: true },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });
        return this.toListItem(task);
    }
    async assign(taskId, dto, assignedByUid) {
        await this.ensureExists(taskId);
        await this.ensureUserExists(dto.assignedToId);
        await this.prisma.taskAssignment.create({
            data: {
                taskUid: taskId,
                assignedToUid: dto.assignedToId,
                assignedByUid,
            },
        });
        return this.findOne(taskId);
    }
    async addComment(taskId, dto, userUid) {
        await this.ensureExists(taskId);
        await this.prisma.taskComment.create({
            data: {
                taskUid: taskId,
                userUid,
                content: dto.content,
            },
        });
        return this.findOne(taskId);
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.task.delete({ where: { uid: id } });
    }
    async ensureExists(id) {
        const task = await this.prisma.task.findUnique({ where: { uid: id } });
        if (!task) {
            throw new common_1.NotFoundException(`Task ${id} not found`);
        }
    }
    async ensureBelongsToEngagement(taskId, engagementId) {
        const task = await this.prisma.task.findFirst({
            where: { uid: taskId, engagementUid: engagementId },
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task ${taskId} not found for engagement ${engagementId}`);
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
    toListItem(task) {
        return {
            id: task.uid,
            engagementId: task.engagementUid,
            engagementTitle: task.engagement.title,
            title: task.title,
            description: task.description,
            status: task.status,
            assigneeName: task.assignments[0]?.assignedTo.name ?? null,
            createdAt: task.createdAt,
        };
    }
    toDetail(task) {
        return {
            ...this.toListItem(task),
            updatedAt: task.updatedAt,
            comments: task.comments.map((comment) => ({
                id: comment.uid,
                authorName: comment.user.name,
                content: comment.content,
                createdAt: comment.createdAt,
            })),
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map