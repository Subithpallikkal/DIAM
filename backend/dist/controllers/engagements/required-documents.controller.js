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
exports.RequiredDocumentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const required_documents_service_1 = require("../../services/engagements/required-documents.service");
const engagement_dto_1 = require("../../dtos/engagements/engagement.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const api_examples_1 = require("../../common/swagger/api-examples");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
let RequiredDocumentsController = class RequiredDocumentsController {
    constructor(requiredDocumentsService) {
        this.requiredDocumentsService = requiredDocumentsService;
    }
    upsert(engagementId, dto) {
        return this.requiredDocumentsService.upsert(engagementId, dto);
    }
    findAll(engagementId) {
        return this.requiredDocumentsService.findAll(engagementId);
    }
};
exports.RequiredDocumentsController = RequiredDocumentsController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create or update a required document checklist item" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1, description: "Engagement id" }),
    (0, swagger_1.ApiBody)({
        type: engagement_dto_1.UpsertRequiredDocumentDto,
        description: "Include id to update; omit id to create",
        examples: {
            create: api_examples_1.SwaggerExamples.requiredDocuments.create,
            update: api_examples_1.SwaggerExamples.requiredDocuments.updateReceived,
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Checklist item saved",
        type: engagement_dto_1.RequiredDocumentListItemDto,
        schema: { example: api_examples_1.SwaggerExamples.requiredDocuments.listItem },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, engagement_dto_1.UpsertRequiredDocumentDto]),
    __metadata("design:returntype", void 0)
], RequiredDocumentsController.prototype, "upsert", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List required document checklist items" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1, description: "Engagement id" }),
    (0, swagger_1.ApiOkResponse)({
        description: "List of checklist items",
        type: [engagement_dto_1.RequiredDocumentListItemDto],
        schema: { example: api_examples_1.SwaggerExamples.requiredDocuments.list },
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
], RequiredDocumentsController.prototype, "findAll", null);
exports.RequiredDocumentsController = RequiredDocumentsController = __decorate([
    (0, swagger_1.ApiTags)("Required Documents"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("engagements/:id/required-documents"),
    __metadata("design:paramtypes", [required_documents_service_1.RequiredDocumentsService])
], RequiredDocumentsController);
//# sourceMappingURL=required-documents.controller.js.map