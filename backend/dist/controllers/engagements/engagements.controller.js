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
exports.EngagementsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const engagements_service_1 = require("../../services/engagements/engagements.service");
const engagement_dto_1 = require("../../dtos/engagements/engagement.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_examples_1 = require("../../common/swagger/api-examples");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
const pagination_dto_1 = require("../../dtos/common/pagination.dto");
let EngagementsController = class EngagementsController {
    constructor(engagementsService) {
        this.engagementsService = engagementsService;
    }
    upsert(dto, user) {
        return this.engagementsService.upsert(dto, user.sub);
    }
    findAll(query) {
        return this.engagementsService.findAll(query);
    }
    findOne(id) {
        return this.engagementsService.findOne(id);
    }
    remove(id) {
        return this.engagementsService.remove(id);
    }
};
exports.EngagementsController = EngagementsController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create or update an audit engagement" }),
    (0, swagger_1.ApiBody)({
        type: engagement_dto_1.UpsertEngagementDto,
        description: "Include id to update; omit id to create",
        examples: {
            create: api_examples_1.SwaggerExamples.engagements.create,
            update: api_examples_1.SwaggerExamples.engagements.update,
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Engagement saved",
        type: engagement_dto_1.EngagementDetailDto,
        schema: { example: api_examples_1.SwaggerExamples.engagements.detail },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [engagement_dto_1.UpsertEngagementDto, Object]),
    __metadata("design:returntype", void 0)
], EngagementsController.prototype, "upsert", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List audit engagements (paginated)" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], EngagementsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get engagement details by id" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1 }),
    (0, swagger_1.ApiOkResponse)({
        description: "Engagement details",
        type: engagement_dto_1.EngagementDetailDto,
        schema: { example: api_examples_1.SwaggerExamples.engagements.detail },
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
], EngagementsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_ONLY),
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete an audit engagement" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1 }),
    (0, swagger_1.ApiOkResponse)({ description: "Engagement deleted" }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Engagement not found",
        schema: { example: api_examples_1.SwaggerExamples.errors.notFound },
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EngagementsController.prototype, "remove", null);
exports.EngagementsController = EngagementsController = __decorate([
    (0, swagger_1.ApiTags)("Engagements"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("engagements"),
    __metadata("design:paramtypes", [engagements_service_1.EngagementsService])
], EngagementsController);
//# sourceMappingURL=engagements.controller.js.map