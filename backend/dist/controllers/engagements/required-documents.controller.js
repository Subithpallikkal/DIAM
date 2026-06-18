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
    create(engagementId, dto) {
        return this.requiredDocumentsService.create(engagementId, dto);
    }
    findAll(engagementId) {
        return this.requiredDocumentsService.findAll(engagementId);
    }
    update(engagementId, docId, dto) {
        return this.requiredDocumentsService.update(engagementId, docId, dto);
    }
};
exports.RequiredDocumentsController = RequiredDocumentsController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Add a required document checklist item" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1, description: "Engagement id" }),
    (0, swagger_1.ApiBody)({
        type: engagement_dto_1.CreateRequiredDocumentDto,
        description: "Checklist item details",
        examples: {
            default: api_examples_1.SwaggerExamples.requiredDocuments.create,
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Checklist item created",
        type: engagement_dto_1.RequiredDocumentListItemDto,
        schema: { example: api_examples_1.SwaggerExamples.requiredDocuments.listItem },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, engagement_dto_1.CreateRequiredDocumentDto]),
    __metadata("design:returntype", void 0)
], RequiredDocumentsController.prototype, "create", null);
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
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Patch)(":docId"),
    (0, swagger_1.ApiOperation)({ summary: "Update a checklist item (e.g. mark as received)" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1, description: "Engagement id" }),
    (0, swagger_1.ApiParam)({ name: "docId", type: Number, example: 1 }),
    (0, swagger_1.ApiBody)({
        type: engagement_dto_1.UpdateRequiredDocumentDto,
        description: "Fields to update",
        examples: {
            markReceived: api_examples_1.SwaggerExamples.requiredDocuments.updateReceived,
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Checklist item updated",
        type: engagement_dto_1.RequiredDocumentListItemDto,
        schema: {
            example: { ...api_examples_1.SwaggerExamples.requiredDocuments.listItem, isReceived: true },
        },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("docId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, engagement_dto_1.UpdateRequiredDocumentDto]),
    __metadata("design:returntype", void 0)
], RequiredDocumentsController.prototype, "update", null);
exports.RequiredDocumentsController = RequiredDocumentsController = __decorate([
    (0, swagger_1.ApiTags)("Required Documents"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("engagements/:id/required-documents"),
    __metadata("design:paramtypes", [required_documents_service_1.RequiredDocumentsService])
], RequiredDocumentsController);
//# sourceMappingURL=required-documents.controller.js.map