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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedDocumentsResponseDto = exports.PaginatedRisksResponseDto = exports.PaginatedTasksResponseDto = exports.PaginatedIssuesResponseDto = exports.PaginatedEngagementsResponseDto = exports.PaginatedClientsResponseDto = exports.PaginatedUsersResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_dto_1 = require("../clients/client.dto");
const document_dto_1 = require("../documents/document.dto");
const engagement_dto_1 = require("../engagements/engagement.dto");
const issue_dto_1 = require("../issues/issue.dto");
const risk_dto_1 = require("../risks/risk.dto");
const task_dto_1 = require("../tasks/task.dto");
const user_dto_1 = require("../users/user.dto");
const pagination_dto_1 = require("./pagination.dto");
class PaginatedUsersResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../users/user.dto").UserListItemDto] }, meta: { required: true, type: () => require("./pagination.dto").PaginatedMetaDto } };
    }
}
exports.PaginatedUsersResponseDto = PaginatedUsersResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [user_dto_1.UserListItemDto] }),
    __metadata("design:type", Array)
], PaginatedUsersResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_dto_1.PaginatedMetaDto }),
    __metadata("design:type", pagination_dto_1.PaginatedMetaDto)
], PaginatedUsersResponseDto.prototype, "meta", void 0);
class PaginatedClientsResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../clients/client.dto").ClientListItemDto] }, meta: { required: true, type: () => require("./pagination.dto").PaginatedMetaDto } };
    }
}
exports.PaginatedClientsResponseDto = PaginatedClientsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [client_dto_1.ClientListItemDto] }),
    __metadata("design:type", Array)
], PaginatedClientsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_dto_1.PaginatedMetaDto }),
    __metadata("design:type", pagination_dto_1.PaginatedMetaDto)
], PaginatedClientsResponseDto.prototype, "meta", void 0);
class PaginatedEngagementsResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../engagements/engagement.dto").EngagementListItemDto] }, meta: { required: true, type: () => require("./pagination.dto").PaginatedMetaDto } };
    }
}
exports.PaginatedEngagementsResponseDto = PaginatedEngagementsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [engagement_dto_1.EngagementListItemDto] }),
    __metadata("design:type", Array)
], PaginatedEngagementsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_dto_1.PaginatedMetaDto }),
    __metadata("design:type", pagination_dto_1.PaginatedMetaDto)
], PaginatedEngagementsResponseDto.prototype, "meta", void 0);
class PaginatedIssuesResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../issues/issue.dto").IssueListItemDto] }, meta: { required: true, type: () => require("./pagination.dto").PaginatedMetaDto } };
    }
}
exports.PaginatedIssuesResponseDto = PaginatedIssuesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [issue_dto_1.IssueListItemDto] }),
    __metadata("design:type", Array)
], PaginatedIssuesResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_dto_1.PaginatedMetaDto }),
    __metadata("design:type", pagination_dto_1.PaginatedMetaDto)
], PaginatedIssuesResponseDto.prototype, "meta", void 0);
class PaginatedTasksResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../tasks/task.dto").TaskListItemDto] }, meta: { required: true, type: () => require("./pagination.dto").PaginatedMetaDto } };
    }
}
exports.PaginatedTasksResponseDto = PaginatedTasksResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [task_dto_1.TaskListItemDto] }),
    __metadata("design:type", Array)
], PaginatedTasksResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_dto_1.PaginatedMetaDto }),
    __metadata("design:type", pagination_dto_1.PaginatedMetaDto)
], PaginatedTasksResponseDto.prototype, "meta", void 0);
class PaginatedRisksResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../risks/risk.dto").RiskListItemDto] }, meta: { required: true, type: () => require("./pagination.dto").PaginatedMetaDto } };
    }
}
exports.PaginatedRisksResponseDto = PaginatedRisksResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [risk_dto_1.RiskListItemDto] }),
    __metadata("design:type", Array)
], PaginatedRisksResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_dto_1.PaginatedMetaDto }),
    __metadata("design:type", pagination_dto_1.PaginatedMetaDto)
], PaginatedRisksResponseDto.prototype, "meta", void 0);
class PaginatedDocumentsResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../documents/document.dto").DocumentListItemDto] }, meta: { required: true, type: () => require("./pagination.dto").PaginatedMetaDto } };
    }
}
exports.PaginatedDocumentsResponseDto = PaginatedDocumentsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [document_dto_1.DocumentListItemDto] }),
    __metadata("design:type", Array)
], PaginatedDocumentsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_dto_1.PaginatedMetaDto }),
    __metadata("design:type", pagination_dto_1.PaginatedMetaDto)
], PaginatedDocumentsResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=paginated-responses.dto.js.map