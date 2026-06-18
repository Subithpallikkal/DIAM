import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "../../services/auth/auth.service";
import { LoginDto } from "../../dtos/auth/login.dto";
import {
  LoginResponseDto,
  MeResponseDto,
} from "../../dtos/auth/auth-response.dto";
import { Public } from "../../common/decorators/public.decorator";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login and receive JWT access token" })
  @ApiBody({
    type: LoginDto,
    description: "User credentials",
    examples: {
      admin: SwaggerExamples.auth.loginAdmin,
      manager: SwaggerExamples.auth.loginManager,
      auditor: SwaggerExamples.auth.loginAuditor,
    },
  })
  @ApiOkResponse({
    description: "Login successful",
    type: LoginResponseDto,
    schema: { example: SwaggerExamples.auth.loginResponse },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
    schema: { example: SwaggerExamples.errors.unauthorized },
  })
  @ApiStandardErrors()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  @RequireRoles(...Roles.ALL)
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Get current logged-in user profile" })
  @ApiOkResponse({
    description: "Current user profile",
    type: MeResponseDto,
    schema: { example: SwaggerExamples.auth.meResponse },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    schema: { example: SwaggerExamples.errors.unauthorized },
  })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }
}
