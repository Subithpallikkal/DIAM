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
exports.TaskDetailDto = exports.TaskCommentDto = exports.TaskListItemDto = exports.CreateTaskCommentDto = exports.AssignTaskDto = exports.UpsertTaskDto = exports.UpdateTaskDto = exports.CreateTaskDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enums_dto_1 = require("../common/enums.dto");
class CreateTaskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 1 }, description: { required: false, type: () => String }, status: { required: false, enum: require("../common/enums.dto").TaskStatus } };
    }
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Risk Review - Cash Controls" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Review cash handling risks for Q1" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.TaskStatus, example: enums_dto_1.TaskStatus.PENDING }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.TaskStatus),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "status", void 0);
class UpdateTaskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, minLength: 1 }, description: { required: false, type: () => String }, status: { required: false, enum: require("../common/enums.dto").TaskStatus } };
    }
}
exports.UpdateTaskDto = UpdateTaskDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Perform revenue substantive testing" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Sample 25 invoices across Q3 and Q4" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_dto_1.TaskStatus, example: enums_dto_1.TaskStatus.IN_PROGRESS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_dto_1.TaskStatus),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "status", void 0);
class UpsertTaskDto extends UpdateTaskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number } };
    }
}
exports.UpsertTaskDto = UpsertTaskDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: "When set, updates the existing task" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpsertTaskDto.prototype, "id", void 0);
class AssignTaskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { assignedToId: { required: true, type: () => Number } };
    }
}
exports.AssignTaskDto = AssignTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AssignTaskDto.prototype, "assignedToId", void 0);
class CreateTaskCommentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { content: { required: true, type: () => String, minLength: 1 } };
    }
}
exports.CreateTaskCommentDto = CreateTaskCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Started reviewing cash vouchers" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateTaskCommentDto.prototype, "content", void 0);
class TaskListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, engagementId: { required: true, type: () => Number }, engagementTitle: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: true, type: () => String, nullable: true }, status: { required: true, type: () => String }, assigneeName: { required: true, type: () => String, nullable: true }, createdAt: { required: true, type: () => Date } };
    }
}
exports.TaskListItemDto = TaskListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], TaskListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], TaskListItemDto.prototype, "engagementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026" }),
    __metadata("design:type", String)
], TaskListItemDto.prototype, "engagementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Risk Review" }),
    __metadata("design:type", String)
], TaskListItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Sample 25 invoices across Q3 and Q4", nullable: true }),
    __metadata("design:type", Object)
], TaskListItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_dto_1.TaskStatus, example: enums_dto_1.TaskStatus.IN_PROGRESS }),
    __metadata("design:type", String)
], TaskListItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Auditor", nullable: true }),
    __metadata("design:type", Object)
], TaskListItemDto.prototype, "assigneeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-19T10:00:00.000Z" }),
    __metadata("design:type", Date)
], TaskListItemDto.prototype, "createdAt", void 0);
class TaskCommentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, authorName: { required: true, type: () => String }, content: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
}
exports.TaskCommentDto = TaskCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], TaskCommentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Auditor" }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "authorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Started reviewing Q4 sales invoices" }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-19T10:00:00.000Z" }),
    __metadata("design:type", Date)
], TaskCommentDto.prototype, "createdAt", void 0);
class TaskDetailDto extends TaskListItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { comments: { required: true, type: () => [require("./task.dto").TaskCommentDto] }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.TaskDetailDto = TaskDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaskCommentDto] }),
    __metadata("design:type", Array)
], TaskDetailDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-19T10:00:00.000Z" }),
    __metadata("design:type", Date)
], TaskDetailDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=task.dto.js.map