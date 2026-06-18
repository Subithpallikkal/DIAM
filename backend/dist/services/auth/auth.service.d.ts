import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../common/prisma/prisma.service";
import { LoginDto } from "../../dtos/auth/login.dto";
import { LoginResponseDto, MeResponseDto } from "../../dtos/auth/auth-response.dto";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<LoginResponseDto>;
    getProfile(userId: number): Promise<MeResponseDto>;
}
