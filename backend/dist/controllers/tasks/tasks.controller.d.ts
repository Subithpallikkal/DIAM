import { TasksService } from "../../services/tasks/tasks.service";
import { AssignTaskDto, CreateTaskCommentDto, CreateTaskDto, TaskDetailDto, TaskListItemDto, UpdateTaskDto } from "../../dtos/tasks/task.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    findAll(query: PaginationQueryDto, engagementId?: string, assigneeId?: string, status?: string): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<TaskListItemDto>>;
    findOne(id: number): Promise<TaskDetailDto>;
    create(engagementId: number, dto: CreateTaskDto, user: JwtPayload): Promise<TaskListItemDto>;
    update(id: number, dto: UpdateTaskDto): Promise<TaskListItemDto>;
    assign(id: number, dto: AssignTaskDto, user: JwtPayload): Promise<TaskListItemDto>;
    addComment(id: number, dto: CreateTaskCommentDto, user: JwtPayload): Promise<TaskDetailDto>;
    remove(id: number): Promise<void>;
}
