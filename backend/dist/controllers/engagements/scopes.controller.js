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
exports.ScopesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scopes_service_1 = require("../../services/engagements/scopes.service");
const engagement_dto_1 = require("../../dtos/engagements/engagement.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const api_examples_1 = require("../../common/swagger/api-examples");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
let ScopesController = class ScopesController {
    constructor(scopesService) {
        this.scopesService = scopesService;
    }
    create(engagementId, dto) {
        return this.scopesService.create(engagementId, dto);
    }
    findAll(engagementId) {
        return this.scopesService.findAll(engagementId);
    }
    remove(engagementId, scopeId) {
        return this.scopesService.remove(engagementId, scopeId);
    }
};
exports.ScopesController = ScopesController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Add a scope item to an engagement" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1, description: "Engagement id" }),
    (0, swagger_1.ApiBody)({
        type: engagement_dto_1.CreateScopeDto,
        description: "Scope item details",
        examples: {
            default: api_examples_1.SwaggerExamples.scopes.create,
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Scope created",
        type: engagement_dto_1.ScopeListItemDto,
        schema: { example: api_examples_1.SwaggerExamples.scopes.listItem },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, engagement_dto_1.CreateScopeDto]),
    __metadata("design:returntype", void 0)
], ScopesController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List scope items for an engagement" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1, description: "Engagement id" }),
    (0, swagger_1.ApiOkResponse)({
        description: "List of scopes",
        type: [engagement_dto_1.ScopeListItemDto],
        schema: { example: api_examples_1.SwaggerExamples.scopes.list },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Engagement not found",
        schema: { example: api_examples_1.SwaggerExamples.errors.notFound },
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ScopesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Delete)(":scopeId"),
    (0, swagger_1.ApiOperation)({ summary: "Remove a scope item from an engagement" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1, description: "Engagement id" }),
    (0, swagger_1.ApiParam)({ name: "scopeId", type: Number, example: 1 }),
    (0, swagger_1.ApiOkResponse)({ description: "Scope removed" }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Scope not found",
        schema: { example: api_examples_1.SwaggerExamples.errors.notFound },
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("scopeId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ScopesController.prototype, "remove", null);
exports.ScopesController = ScopesController = __decorate([
    (0, swagger_1.ApiTags)("Engagement Scopes"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("engagements/:id/scopes"),
    __metadata("design:paramtypes", [scopes_service_1.ScopesService])
], ScopesController);
//# sourceMappingURL=scopes.controller.js.map