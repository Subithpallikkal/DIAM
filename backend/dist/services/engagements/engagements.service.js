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
exports.EngagementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
const engagement_dto_1 = require("../../dtos/common/engagement.dto");
let EngagementsService = class EngagementsService {
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
        return this.toDetail(engagement);
    }
    async findAll(query) {
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
        const where = this.buildWhere(query.search);
        const [engagements, total] = await Promise.all([
            this.prisma.auditEngagement.findMany({
                where,
                include: { client: true },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.prisma.auditEngagement.count({ where }),
        ]);
        return (0, pagination_util_1.buildPaginatedResponse)(engagements.map((engagement) => this.toListItem(engagement)), total, page, limit);
    }
    async findOne(id) {
        const engagement = await this.prisma.auditEngagement.findUnique({
            where: { uid: id },
            include: { client: true },
        });
        if (!engagement) {
            throw new common_1.NotFoundException(`Engagement ${id} not found`);
        }
        return this.toDetail(engagement);
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
        return this.toDetail(engagement);
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.auditEngagement.delete({ where: { uid: id } });
        this.cache.invalidatePrefix("dashboard:");
    }
    buildWhere(search) {
        if (!search?.trim())
            return {};
        const term = search.trim();
        return {
            OR: [
                { title: { contains: term, mode: "insensitive" } },
                { auditType: { contains: term, mode: "insensitive" } },
                { client: { name: { contains: term, mode: "insensitive" } } },
            ],
        };
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
exports.EngagementsService = EngagementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], EngagementsService);
//# sourceMappingURL=engagements.service.js.map