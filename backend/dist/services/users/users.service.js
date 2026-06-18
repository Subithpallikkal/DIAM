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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
let UsersService = class UsersService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async findAll(query) {
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                include: { role: true },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.prisma.user.count(),
        ]);
        return (0, pagination_util_1.buildPaginatedResponse)(users.map((user) => ({
            uid: user.uid,
            name: user.name,
            email: user.email,
            role: user.role.name,
            isActive: user.isActive,
            createdAt: user.createdAt,
        })), total, page, limit);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map