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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
let ClientsService = class ClientsService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async create(dto, createdByUid) {
        const client = await this.prisma.client.create({
            data: {
                ...dto,
                createdByUid,
            },
        });
        this.cache.invalidatePrefix("dashboard:");
        return this.toDetail(client);
    }
    async upsert(dto, createdByUid) {
        const { id, ...data } = dto;
        if (id != null) {
            return this.update(id, data);
        }
        if (!data.name?.trim()) {
            throw new common_1.BadRequestException("name is required");
        }
        return this.create(data, createdByUid);
    }
    async findAll(query) {
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
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
        return (0, pagination_util_1.buildPaginatedResponse)(clients.map((client) => this.toListItem(client)), total, page, limit);
    }
    async findOne(id) {
        const client = await this.prisma.client.findUnique({
            where: { uid: id },
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client ${id} not found`);
        }
        return this.toDetail(client);
    }
    async update(id, dto) {
        await this.ensureExists(id);
        const client = await this.prisma.client.update({
            where: { uid: id },
            data: dto,
        });
        this.cache.invalidatePrefix("dashboard:");
        return this.toDetail(client);
    }
    async deactivate(id) {
        await this.ensureExists(id);
        const client = await this.prisma.client.update({
            where: { uid: id },
            data: { isActive: false },
        });
        this.cache.invalidatePrefix("dashboard:");
        return this.toDetail(client);
    }
    buildWhere(query) {
        const where = {};
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
    buildOrderBy(query) {
        const direction = (0, pagination_util_1.resolveSortDirection)(query);
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
    async ensureExists(id) {
        const client = await this.prisma.client.findUnique({
            where: { uid: id },
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client ${id} not found`);
        }
    }
    toListItem(client) {
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
    toDetail(client) {
        return {
            ...this.toListItem(client),
            code: client.code,
            address: client.address,
            updatedAt: client.updatedAt,
        };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map