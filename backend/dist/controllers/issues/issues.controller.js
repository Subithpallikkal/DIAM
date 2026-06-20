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
exports.IssuesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const issues_service_1 = require("../../services/issues/issues.service");
const issue_dto_1 = require("../../dtos/issues/issue.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
const api_examples_1 = require("../../common/swagger/api-examples");
const pagination_dto_1 = require("../../dtos/common/pagination.dto");
const paginated_responses_dto_1 = require("../../dtos/common/paginated-responses.dto");
let IssuesController = class IssuesController {
    constructor(issuesService) {
        this.issuesService = issuesService;
    }
    findAll(query, engagementId, status) {
        return this.issuesService.findAll(query, {
            engagementId: engagementId ? Number(engagementId) : undefined,
            status,
        });
    }
    findOne(id) {
        return this.issuesService.findOne(id);
    }
    upsert(engagementId, dto, user) {
        return this.issuesService.upsert(engagementId, dto, user.sub);
    }
    assign(id, dto, user) {
        return this.issuesService.assign(id, dto, user.sub);
    }
    assignClient(id, dto) {
        return this.issuesService.assignClient(id, dto);
    }
    addFinding(id, dto, user) {
        return this.issuesService.addFinding(id, dto, user.sub);
    }
    remove(id) {
        return this.issuesService.remove(id);
    }
};
exports.IssuesController = IssuesController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("issues"),
    (0, swagger_1.ApiOperation)({ summary: "List issues" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "status", required: false, type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: "Paginated issue list",
        type: paginated_responses_dto_1.PaginatedIssuesResponseDto,
        schema: { example: api_examples_1.SwaggerExamples.issues.paginated },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)("engagementId")),
    __param(2, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String, String]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("issues/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get issue details" }),
    (0, swagger_1.ApiOkResponse)({
        type: issue_dto_1.IssueDetailDto,
        schema: { example: api_examples_1.SwaggerExamples.issues.detail },
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Post)("engagements/:engagementId/issues"),
    (0, swagger_1.ApiOperation)({ summary: "Create or update issue for engagement" }),
    (0, swagger_1.ApiBody)({
        type: issue_dto_1.UpsertIssueDto,
        examples: {
            create: api_examples_1.SwaggerExamples.issues.create,
            update: api_examples_1.SwaggerExamples.issues.update,
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: issue_dto_1.IssueListItemDto,
        schema: { example: api_examples_1.SwaggerExamples.issues.listItem },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("engagementId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, issue_dto_1.UpsertIssueDto, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "upsert", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)("issues/:id/assign"),
    (0, swagger_1.ApiOperation)({ summary: "Assign issue to user" }),
    (0, swagger_1.ApiBody)({ type: issue_dto_1.AssignIssueDto, examples: { default: api_examples_1.SwaggerExamples.issues.assign } }),
    (0, swagger_1.ApiOkResponse)({
        type: issue_dto_1.IssueDetailDto,
        schema: { example: api_examples_1.SwaggerExamples.issues.detail },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, issue_dto_1.AssignIssueDto, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "assign", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)("issues/:id/assign-client"),
    (0, swagger_1.ApiOperation)({ summary: "Assign issue to client" }),
    (0, swagger_1.ApiBody)({
        type: issue_dto_1.AssignIssueClientDto,
        examples: { default: api_examples_1.SwaggerExamples.issues.assignClient },
    }),
    (0, swagger_1.ApiOkResponse)({
        type: issue_dto_1.IssueDetailDto,
        schema: { example: api_examples_1.SwaggerExamples.issues.detail },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, issue_dto_1.AssignIssueClientDto]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "assignClient", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Post)("issues/:id/findings"),
    (0, swagger_1.ApiOperation)({ summary: "Add finding to issue" }),
    (0, swagger_1.ApiBody)({ type: issue_dto_1.CreateFindingDto, examples: { default: api_examples_1.SwaggerExamples.issues.finding } }),
    (0, swagger_1.ApiCreatedResponse)({
        type: issue_dto_1.FindingDto,
        schema: { example: api_examples_1.SwaggerExamples.issues.findingItem },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, issue_dto_1.CreateFindingDto, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "addFinding", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Delete)("issues/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete issue" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "remove", null);
exports.IssuesController = IssuesController = __decorate([
    (0, swagger_1.ApiTags)("Issues"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [issues_service_1.IssuesService])
], IssuesController);
//# sourceMappingURL=issues.controller.js.map