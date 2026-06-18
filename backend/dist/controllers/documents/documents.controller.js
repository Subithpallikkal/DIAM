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
exports.DocumentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const documents_service_1 = require("../../services/documents/documents.service");
const document_storage_service_1 = require("../../services/documents/document-storage.service");
const document_dto_1 = require("../../dtos/documents/document.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
const pagination_dto_1 = require("../../dtos/common/pagination.dto");
let DocumentsController = class DocumentsController {
    constructor(documentsService, storageService) {
        this.documentsService = documentsService;
        this.storageService = storageService;
    }
    findCategories() {
        return this.documentsService.findCategories();
    }
    createCategory(dto) {
        return this.documentsService.createCategory(dto);
    }
    findAll(query, clientId, engagementId, categoryId) {
        return this.documentsService.findAll(query, {
            clientId: clientId ? Number(clientId) : undefined,
            engagementId: engagementId ? Number(engagementId) : undefined,
            categoryId: categoryId ? Number(categoryId) : undefined,
        });
    }
    upload(file, clientId, engagementId, categoryId, user) {
        return this.storageService.upload(file, {
            clientId: Number(clientId),
            engagementId: engagementId ? Number(engagementId) : undefined,
            categoryId: categoryId ? Number(categoryId) : undefined,
            uploadedByUid: user.sub,
        });
    }
    findOne(id) {
        return this.documentsService.findOne(id);
    }
    download(id, user) {
        return this.storageService.download(id, user.sub);
    }
    view(id, user) {
        return this.storageService.view(id, user.sub);
    }
    getLogs(id) {
        return this.documentsService.getLogs(id);
    }
    remove(id, user) {
        return this.storageService.deleteFile(id, user.sub);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("categories"),
    (0, swagger_1.ApiOperation)({ summary: "List document categories" }),
    (0, swagger_1.ApiOkResponse)({ type: [document_dto_1.DocumentCategoryDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findCategories", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)("categories"),
    (0, swagger_1.ApiOperation)({ summary: "Create document category" }),
    (0, swagger_1.ApiCreatedResponse)({ type: document_dto_1.DocumentCategoryDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_dto_1.CreateDocumentCategoryDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "createCategory", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List uploaded documents" }),
    (0, swagger_1.ApiQuery)({ name: "clientId", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "categoryId", required: false, type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: [document_dto_1.DocumentListItemDto] }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)("clientId")),
    __param(2, (0, common_1.Query)("engagementId")),
    __param(3, (0, common_1.Query)("categoryId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String, String, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Post)("upload"),
    (0, swagger_1.ApiOperation)({ summary: "Upload a document file" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                file: { type: "string", format: "binary" },
                clientId: { type: "number" },
                engagementId: { type: "number" },
                categoryId: { type: "number" },
            },
            required: ["file", "clientId"],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiCreatedResponse)({ type: document_dto_1.DocumentListItemDto }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)("clientId")),
    __param(2, (0, common_1.Body)("engagementId")),
    __param(3, (0, common_1.Body)("categoryId")),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "upload", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get document metadata" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: document_dto_1.DocumentListItemDto }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(":id/download"),
    (0, swagger_1.ApiOperation)({ summary: "Download document file" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "download", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(":id/view"),
    (0, swagger_1.ApiOperation)({ summary: "View document inline" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "view", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(":id/logs"),
    (0, swagger_1.ApiOperation)({ summary: "Get document audit trail" }),
    (0, swagger_1.ApiOkResponse)({ type: [document_dto_1.DocumentLogDto] }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "getLogs", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete document" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "remove", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, swagger_1.ApiTags)("Documents"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("documents"),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService,
        document_storage_service_1.DocumentStorageService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map