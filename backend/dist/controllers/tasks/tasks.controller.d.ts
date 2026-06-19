import { TasksService } from "../../services/tasks/tasks.service";
import { AssignTaskDto, CreateTaskCommentDto, TaskDetailDto, TaskListItemDto, UpsertTaskDto } from "../../dtos/tasks/task.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    findAll(query: PaginationQueryDto, engagementId?: string, assigneeId?: string, status?: string): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<TaskListItemDto>>;
    findOne(id: number): Promise<TaskDetailDto>;
    upsert(engagementId: number, dto: UpsertTaskDto, user: JwtPayload): Promise<TaskListItemDto>;
    assign(id: number, dto: AssignTaskDto, user: JwtPayload): Promise<TaskListItemDto>;
    addComment(id: number, dto: CreateTaskCommentDto, user: JwtPayload): Promise<TaskDetailDto>;
    remove(id: number): Promise<void>;
}
