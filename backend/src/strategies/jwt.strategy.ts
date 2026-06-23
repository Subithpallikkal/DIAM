import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../common/prisma/prisma.service";
import { JwtPayload } from "../common/interfaces/jwt-payload.interface";
import { RoleName } from "../dtos/common/role.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private static readonly USER_CACHE_TTL_MS = 5 * 60 * 1000;

  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "dev-secret-change-me",
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const cacheKey = `auth:user:${payload.sub}`;
    const cached = this.get(cacheKey);
    if (cached) return cached;

    const user = await this.prisma.user.findUnique({
      where: { uid: payload.sub },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    const resolved: JwtPayload = {
      sub: user.uid,
      email: user.email,
      role: user.role.name as RoleName,
    };
    this.set(cacheKey, resolved, JwtStrategy.USER_CACHE_TTL_MS);
    return resolved;
  }

  private readonly prismaCache = new Map<string, { value: JwtPayload; expiresAt: number }>();

  private get(key: string): JwtPayload | null {
    const entry = this.prismaCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.prismaCache.delete(key);
      return null;
    }
    return entry.value;
  }

  private set(key: string, value: JwtPayload, ttlMs: number): void {
    this.prismaCache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}
