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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../../services/auth/auth.service");
const login_dto_1 = require("../../dtos/auth/login.dto");
const auth_response_dto_1 = require("../../dtos/auth/auth-response.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_examples_1 = require("../../common/swagger/api-examples");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(dto) {
        return this.authService.login(dto);
    }
    getProfile(user) {
        return this.authService.getProfile(user.sub);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({ summary: "Login and receive JWT access token" }),
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
        description: "User credentials",
        examples: {
            admin: api_examples_1.SwaggerExamples.auth.loginAdmin,
            manager: api_examples_1.SwaggerExamples.auth.loginManager,
            auditor: api_examples_1.SwaggerExamples.auth.loginAuditor,
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Login successful",
        type: auth_response_dto_1.LoginResponseDto,
        schema: { example: api_examples_1.SwaggerExamples.auth.loginResponse },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Invalid credentials",
        schema: { example: api_examples_1.SwaggerExamples.errors.unauthorized },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, swagger_1.ApiOperation)({ summary: "Get current logged-in user profile" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Current user profile",
        type: auth_response_dto_1.MeResponseDto,
        schema: { example: api_examples_1.SwaggerExamples.auth.meResponse },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized",
        schema: { example: api_examples_1.SwaggerExamples.errors.unauthorized },
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map