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
exports.RisksController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const risks_service_1 = require("../../services/risks/risks.service");
const risk_dto_1 = require("../../dtos/risks/risk.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
const api_examples_1 = require("../../common/swagger/api-examples");
const pagination_dto_1 = require("../../dtos/common/pagination.dto");
const paginated_responses_dto_1 = require("../../dtos/common/paginated-responses.dto");
let RisksController = class RisksController {
    constructor(risksService) {
        this.risksService = risksService;
    }
    findAll(query, engagementId) {
        return this.risksService.findAll(query, engagementId ? Number(engagementId) : undefined);
    }
    findOne(id) {
        return this.risksService.findOne(id);
    }
    upsert(engagementId, dto, user) {
        return this.risksService.upsert(engagementId, dto, user.sub);
    }
    remove(id) {
        return this.risksService.remove(id);
    }
    findChecklists(id) {
        return this.risksService.findChecklists(id);
    }
    upsertChecklist(id, dto) {
        return this.risksService.upsertChecklistItem(id, dto);
    }
    assignChecklist(id, checklistId, dto, user) {
        return this.risksService.assignChecklistItem(id, checklistId, dto, user.sub);
    }
};
exports.RisksController = RisksController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("risks"),
    (0, swagger_1.ApiOperation)({ summary: "List risks" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", required: false, type: Number }),
    (0, swagger_1.ApiOkResponse)({
        description: "Paginated risk list",
        type: paginated_responses_dto_1.PaginatedRisksResponseDto,
        schema: { example: api_examples_1.SwaggerExamples.risks.paginated },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)("engagementId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String]),
    __metadata("design:returntype", void 0)
], RisksController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("risks/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get risk details" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number }),
    (0, swagger_1.ApiOkResponse)({
        type: risk_dto_1.RiskListItemDto,
        schema: { example: api_examples_1.SwaggerExamples.risks.listItem },
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RisksController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)("engagements/:engagementId/risks"),
    (0, swagger_1.ApiOperation)({ summary: "Create or update risk for engagement" }),
    (0, swagger_1.ApiParam)({ name: "engagementId", type: Number }),
    (0, swagger_1.ApiBody)({
        type: risk_dto_1.UpsertRiskDto,
        examples: {
            create: api_examples_1.SwaggerExamples.risks.create,
            update: api_examples_1.SwaggerExamples.risks.update,
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: risk_dto_1.RiskListItemDto,
        schema: { example: api_examples_1.SwaggerExamples.risks.listItem },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("engagementId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, risk_dto_1.UpsertRiskDto, Object]),
    __metadata("design:returntype", void 0)
], RisksController.prototype, "upsert", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Delete)("risks/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete risk" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RisksController.prototype, "remove", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("risks/:id/checklists"),
    (0, swagger_1.ApiOperation)({ summary: "List checklist items for risk" }),
    (0, swagger_1.ApiOkResponse)({
        type: [risk_dto_1.ChecklistItemDto],
        schema: { example: api_examples_1.SwaggerExamples.risks.checklistList },
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RisksController.prototype, "findChecklists", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)("risks/:id/checklists"),
    (0, swagger_1.ApiOperation)({ summary: "Create or update checklist item" }),
    (0, swagger_1.ApiBody)({
        type: risk_dto_1.UpsertChecklistItemDto,
        examples: {
            create: api_examples_1.SwaggerExamples.risks.checklistCreate,
            update: api_examples_1.SwaggerExamples.risks.checklistUpdate,
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: risk_dto_1.ChecklistItemDto,
        schema: { example: api_examples_1.SwaggerExamples.risks.checklistItem },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, risk_dto_1.UpsertChecklistItemDto]),
    __metadata("design:returntype", void 0)
], RisksController.prototype, "upsertChecklist", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)("risks/:id/checklists/:checklistId/assign"),
    (0, swagger_1.ApiOperation)({ summary: "Assign checklist item to user" }),
    (0, swagger_1.ApiBody)({
        type: risk_dto_1.AssignChecklistDto,
        examples: { default: api_examples_1.SwaggerExamples.risks.assignChecklist },
    }),
    (0, swagger_1.ApiOkResponse)({
        type: risk_dto_1.ChecklistItemDto,
        schema: { example: api_examples_1.SwaggerExamples.risks.checklistItem },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("checklistId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, risk_dto_1.AssignChecklistDto, Object]),
    __metadata("design:returntype", void 0)
], RisksController.prototype, "assignChecklist", null);
exports.RisksController = RisksController = __decorate([
    (0, swagger_1.ApiTags)("Risks"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [risks_service_1.RisksService])
], RisksController);
//# sourceMappingURL=risks.controller.js.map