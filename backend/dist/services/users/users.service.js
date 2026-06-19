"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
let UsersService = class UsersService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async create(dto) {
        const role = await this.prisma.role.findUnique({ where: { name: dto.role } });
        if (!role) {
            throw new common_1.NotFoundException(`Role ${dto.role} not found`);
        }
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException("Email already in use");
        }
        const password = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password,
                roleUid: role.uid,
            },
            include: { role: true },
        });
        return this.toDetail(user);
    }
    async findAll(query) {
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
        const where = this.buildWhere(query);
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                include: { role: true },
                orderBy: this.buildOrderBy(query),
                skip,
                take,
            }),
            this.prisma.user.count({ where }),
        ]);
        return (0, pagination_util_1.buildPaginatedResponse)(users.map((user) => this.toListItem(user)), total, page, limit);
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { uid: id },
            include: { role: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User ${id} not found`);
        }
        return this.toDetail(user);
    }
    async update(id, dto) {
        await this.ensureExists(id);
        if (dto.email) {
            const existing = await this.prisma.user.findFirst({
                where: {
                    email: dto.email,
                    NOT: { uid: id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException("Email already in use");
            }
        }
        let roleUid;
        if (dto.role) {
            const role = await this.prisma.role.findUnique({ where: { name: dto.role } });
            if (!role) {
                throw new common_1.NotFoundException(`Role ${dto.role} not found`);
            }
            roleUid = role.uid;
        }
        const data = {
            name: dto.name,
            email: dto.email,
            isActive: dto.isActive,
            ...(roleUid ? { role: { connect: { uid: roleUid } } } : {}),
            ...(dto.password ? { password: await bcrypt.hash(dto.password, 10) } : {}),
        };
        const user = await this.prisma.user.update({
            where: { uid: id },
            data,
            include: { role: true },
        });
        return this.toDetail(user);
    }
    async deactivate(id, currentUserId) {
        if (id === currentUserId) {
            throw new common_1.BadRequestException("You cannot deactivate your own account");
        }
        await this.ensureExists(id);
        const user = await this.prisma.user.update({
            where: { uid: id },
            data: { isActive: false },
            include: { role: true },
        });
        return this.toDetail(user);
    }
    buildWhere(query) {
        const where = {};
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        if (query.role) {
            where.role = { name: query.role };
        }
        if (query.search?.trim()) {
            const search = query.search.trim();
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
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
            case "role":
                return { role: { name: direction } };
            case "isActive":
                return { isActive: direction };
            case "createdAt":
                return { createdAt: direction };
            default:
                return { createdAt: "desc" };
        }
    }
    async ensureExists(id) {
        const user = await this.prisma.user.findUnique({ where: { uid: id } });
        if (!user) {
            throw new common_1.NotFoundException(`User ${id} not found`);
        }
    }
    toListItem(user) {
        return {
            id: user.uid,
            name: user.name,
            email: user.email,
            role: user.role.name,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
    toDetail(user) {
        return {
            ...this.toListItem(user),
            updatedAt: user.updatedAt,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map