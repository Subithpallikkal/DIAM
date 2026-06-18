import { AuthService } from "../../services/auth/auth.service";
import { LoginDto } from "../../dtos/auth/login.dto";
import { LoginResponseDto, MeResponseDto } from "../../dtos/auth/auth-response.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<LoginResponseDto>;
    getProfile(user: JwtPayload): Promise<MeResponseDto>;
}
