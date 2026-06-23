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
var EngagementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngagementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
const engagement_dto_1 = require("../../dtos/common/engagement.dto");
let EngagementsService = EngagementsService_1 = class EngagementsService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async create(dto, createdByUid) {
        await this.ensureClientExists(dto.clientId);
        const engagement = await this.prisma.auditEngagement.create({
            data: {
                clientUid: dto.clientId,
                title: dto.title,
                auditType: dto.auditType,
                financialYear: dto.financialYear,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                status: dto.status ?? engagement_dto_1.EngagementStatus.DRAFT,
                description: dto.description,
                createdByUid,
            },
            include: { client: true },
        });
        this.cache.invalidatePrefix("engagements:");
        return this.toDetail(engagement);
    }
    async upsert(dto, createdByUid) {
        const { id, ...data } = dto;
        if (id != null) {
            return this.update(id, data);
        }
        if (!data.clientId || !data.title?.trim() || !data.auditType?.trim()) {
            throw new common_1.BadRequestException("clientId, title, and auditType are required");
        }
        return this.create(data, createdByUid);
    }
    async findAll(query) {
        const cacheKey = this.buildListCacheKey(query);
        const cached = this.cache.get(cacheKey);
        if (cached)
            return cached;
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
        const where = this.buildWhere(query);
        const [engagements, total] = await Promise.all([
            this.prisma.auditEngagement.findMany({
                where,
                select: {
                    uid: true,
                    clientUid: true,
                    title: true,
                    auditType: true,
                    financialYear: true,
                    status: true,
                    startDate: true,
                    endDate: true,
                    createdAt: true,
                    client: {
                        select: { name: true },
                    },
                },
                orderBy: this.buildOrderBy(query),
                skip,
                take,
            }),
            this.prisma.auditEngagement.count({ where }),
        ]);
        const result = (0, pagination_util_1.buildPaginatedResponse)(engagements.map((engagement) => this.toListItem(engagement)), total, page, limit);
        this.cache.set(cacheKey, result, EngagementsService_1.LIST_CACHE_TTL_MS);
        return result;
    }
    async findOne(id) {
        const cacheKey = `engagements:detail:${id}`;
        const cached = this.cache.get(cacheKey);
        if (cached)
            return cached;
        const engagement = await this.prisma.auditEngagement.findUnique({
            where: { uid: id },
            include: { client: true },
        });
        if (!engagement) {
            throw new common_1.NotFoundException(`Engagement ${id} not found`);
        }
        const detail = this.toDetail(engagement);
        this.cache.set(cacheKey, detail, EngagementsService_1.DETAIL_CACHE_TTL_MS);
        return detail;
    }
    async update(id, dto) {
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
        this.cache.invalidatePrefix("engagements:");
        return this.toDetail(engagement);
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.auditEngagement.delete({ where: { uid: id } });
        this.cache.invalidatePrefix("engagements:");
        this.cache.invalidatePrefix("dashboard:");
    }
    buildListCacheKey(query) {
        const parts = [
            query.page ?? 1,
            query.limit ?? 20,
            query.search?.trim() ?? "",
            query.sortBy ?? "",
            query.sortOrder ?? "",
            query.status ?? "",
        ];
        return `engagements:list:${parts.join("|")}`;
    }
    buildWhere(query) {
        const where = {};
        if (query.status) {
            where.status = query.status;
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
    buildOrderBy(query) {
        const direction = (0, pagination_util_1.resolveSortDirection)(query);
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
    async ensureExists(id) {
        const engagement = await this.prisma.auditEngagement.findUnique({
            where: { uid: id },
        });
        if (!engagement) {
            throw new common_1.NotFoundException(`Engagement ${id} not found`);
        }
    }
    async ensureClientExists(clientId) {
        const client = await this.prisma.client.findUnique({
            where: { uid: clientId },
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client ${clientId} not found`);
        }
    }
    toListItem(engagement) {
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
    toDetail(engagement) {
        return {
            ...this.toListItem(engagement),
            description: engagement.description,
            updatedAt: engagement.updatedAt,
        };
    }
};
exports.EngagementsService = EngagementsService;
EngagementsService.LIST_CACHE_TTL_MS = 30 * 1000;
EngagementsService.DETAIL_CACHE_TTL_MS = 60 * 1000;
exports.EngagementsService = EngagementsService = EngagementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], EngagementsService);
//# sourceMappingURL=engagements.service.js.map