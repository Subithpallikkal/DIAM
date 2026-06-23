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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const prisma_service_1 = require("../common/prisma/prisma.service");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET ?? "dev-secret-change-me",
        });
        this.prisma = prisma;
        this.prismaCache = new Map();
    }
    async validate(payload) {
        const cacheKey = `auth:user:${payload.sub}`;
        const cached = this.get(cacheKey);
        if (cached)
            return cached;
        const user = await this.prisma.user.findUnique({
            where: { uid: payload.sub },
            include: { role: true },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException();
        }
        const resolved = {
            sub: user.uid,
            email: user.email,
            role: user.role.name,
        };
        this.set(cacheKey, resolved, JwtStrategy_1.USER_CACHE_TTL_MS);
        return resolved;
    }
    get(key) {
        const entry = this.prismaCache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.prismaCache.delete(key);
            return null;
        }
        return entry.value;
    }
    set(key, value, ttlMs) {
        this.prismaCache.set(key, { value, expiresAt: Date.now() + ttlMs });
    }
};
exports.JwtStrategy = JwtStrategy;
JwtStrategy.USER_CACHE_TTL_MS = 5 * 60 * 1000;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map