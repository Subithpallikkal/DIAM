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
exports.TasksController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("../../services/tasks/tasks.service");
const task_dto_1 = require("../../dtos/tasks/task.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_error_decorator_1 = require("../../common/swagger/api-error.decorator");
const pagination_dto_1 = require("../../dtos/common/pagination.dto");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    findAll(query, engagementId, assigneeId, status) {
        return this.tasksService.findAll(query, {
            engagementId: engagementId ? Number(engagementId) : undefined,
            assigneeId: assigneeId ? Number(assigneeId) : undefined,
            status,
        });
    }
    findOne(id) {
        return this.tasksService.findOne(id);
    }
    upsert(engagementId, dto, user) {
        return this.tasksService.upsert(engagementId, dto, user.sub);
    }
    assign(id, dto, user) {
        return this.tasksService.assign(id, dto, user.sub);
    }
    addComment(id, dto, user) {
        return this.tasksService.addComment(id, dto, user.sub);
    }
    remove(id) {
        return this.tasksService.remove(id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("tasks"),
    (0, swagger_1.ApiOperation)({ summary: "List tasks" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "assigneeId", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "status", required: false, type: String }),
    (0, swagger_1.ApiOkResponse)({ type: [task_dto_1.TaskListItemDto] }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)("engagementId")),
    __param(2, (0, common_1.Query)("assigneeId")),
    __param(3, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String, String, String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("tasks/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get task details" }),
    (0, swagger_1.ApiOkResponse)({ type: task_dto_1.TaskDetailDto }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)("engagements/:engagementId/tasks"),
    (0, swagger_1.ApiOperation)({ summary: "Create or update task for engagement" }),
    (0, swagger_1.ApiCreatedResponse)({ type: task_dto_1.TaskListItemDto }),
    (0, api_error_decorator_1.ApiStandardErrors)(),
    __param(0, (0, common_1.Param)("engagementId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, task_dto_1.UpsertTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "upsert", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Post)("tasks/:id/assign"),
    (0, swagger_1.ApiOperation)({ summary: "Assign task to user" }),
    openapi.ApiResponse({ status: 201, type: require("../../dtos/tasks/task.dto").TaskListItemDto }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, task_dto_1.AssignTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "assign", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Post)("tasks/:id/comments"),
    (0, swagger_1.ApiOperation)({ summary: "Add comment to task" }),
    openapi.ApiResponse({ status: 201, type: require("../../dtos/tasks/task.dto").TaskDetailDto }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, task_dto_1.CreateTaskCommentDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "addComment", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ADMIN_MANAGER),
    (0, common_1.Delete)("tasks/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete task" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)("Tasks"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map