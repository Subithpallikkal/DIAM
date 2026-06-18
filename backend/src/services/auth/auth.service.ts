import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../common/prisma/prisma.service";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { LoginDto } from "../../dtos/auth/login.dto";
import {
  LoginResponseDto,
  MeResponseDto,
} from "../../dtos/auth/auth-response.dto";
import { RoleName } from "../../dtos/common/role.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const role = user.role.name as RoleName;
    const payload: JwtPayload = {
      sub: user.uid,
      email: user.email,
      role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role,
      },
    };
  }

  async getProfile(userId: number): Promise<MeResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { uid: userId },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: user.role.name as RoleName,
    };
  }
}
