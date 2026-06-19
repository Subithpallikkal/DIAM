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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("../../services/users/users.service");
const user_dto_1 = require("../../dtos/users/user.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const pagination_dto_1 = require("../../dtos/common/pagination.dto");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    upsert(dto) {
        return this.usersService.upsert(dto);
    }
    findAll(query) {
        return this.usersService.findAll(query);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    deactivate(id, user) {
        return this.usersService.deactivate(id, user.sub);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_ONLY),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create or update a user (Admin only)" }),
    (0, swagger_1.ApiBody)({ type: user_dto_1.UpsertUserDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: "User saved", type: user_dto_1.UserDetailDto }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpsertUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "upsert", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List all users (Admin/Manager)" }),
    (0, swagger_1.ApiOkResponse)({ description: "List of users", type: [user_dto_1.UserListItemDto] }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get user details by id" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1 }),
    (0, swagger_1.ApiOkResponse)({ description: "User details", type: user_dto_1.UserDetailDto }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_ONLY),
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Deactivate a user (Admin only)" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1 }),
    (0, swagger_1.ApiOkResponse)({ description: "User deactivated", type: user_dto_1.UserDetailDto }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deactivate", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)("Users"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map