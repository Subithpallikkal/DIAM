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
exports.ClientsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clients_service_1 = require("../../services/clients/clients.service");
const client_dto_1 = require("../../dtos/clients/client.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_examples_1 = require("../../common/swagger/api-examples");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
const pagination_dto_1 = require("../../dtos/common/pagination.dto");
let ClientsController = class ClientsController {
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    upsert(dto, user) {
        return this.clientsService.upsert(dto, user.sub);
    }
    findAll(query) {
        return this.clientsService.findAll(query);
    }
    findOne(id) {
        return this.clientsService.findOne(id);
    }
    deactivate(id) {
        return this.clientsService.deactivate(id);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create or update a client" }),
    (0, swagger_1.ApiBody)({
        type: client_dto_1.UpsertClientDto,
        description: "Include id to update; omit id to create",
        examples: {
            create: api_examples_1.SwaggerExamples.clients.create,
            update: api_examples_1.SwaggerExamples.clients.update,
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Client saved",
        type: client_dto_1.ClientDetailDto,
        schema: { example: api_examples_1.SwaggerExamples.clients.detail },
    }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_dto_1.UpsertClientDto, Object]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "upsert", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List clients (paginated)" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get client details by id" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1 }),
    (0, swagger_1.ApiOkResponse)({
        description: "Client details",
        type: client_dto_1.ClientDetailDto,
        schema: { example: api_examples_1.SwaggerExamples.clients.detail },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Client not found",
        schema: { example: api_examples_1.SwaggerExamples.errors.notFound },
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_ONLY),
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Soft delete (deactivate) a client" }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, example: 1 }),
    (0, swagger_1.ApiOkResponse)({
        description: "Client deactivated",
        type: client_dto_1.ClientDetailDto,
        schema: {
            example: { ...api_examples_1.SwaggerExamples.clients.detail, isActive: false },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Client not found",
        schema: { example: api_examples_1.SwaggerExamples.errors.notFound },
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "deactivate", null);
exports.ClientsController = ClientsController = __decorate([
    (0, swagger_1.ApiTags)("Clients"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("clients"),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map