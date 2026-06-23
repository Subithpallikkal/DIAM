import { Strategy } from "passport-jwt";
import { PrismaService } from "../common/prisma/prisma.service";
import { JwtPayload } from "../common/interfaces/jwt-payload.interface";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    private static readonly USER_CACHE_TTL_MS;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<JwtPayload>;
    private readonly prismaCache;
    private get;
    private set;
}
export {};
