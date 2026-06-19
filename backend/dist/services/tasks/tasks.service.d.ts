import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { AssignTaskDto, CreateTaskCommentDto, CreateTaskDto, TaskDetailDto, TaskListItemDto, UpdateTaskDto } from "../../dtos/tasks/task.dto";
export declare class TasksService {
    private prisma;
    private cache;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(query: PaginationQueryDto, filters?: {
        engagementId?: number;
        assigneeId?: number;
        status?: string;
    }): Promise<PaginatedResponseDto<TaskListItemDto>>;
    private buildOrderBy;
    findOne(id: number): Promise<TaskDetailDto>;
    create(engagementId: number, dto: CreateTaskDto, createdByUid: number): Promise<TaskListItemDto>;
    update(id: number, dto: UpdateTaskDto): Promise<TaskListItemDto>;
    assign(taskId: number, dto: AssignTaskDto, assignedByUid: number): Promise<TaskListItemDto>;
    addComment(taskId: number, dto: CreateTaskCommentDto, userUid: number): Promise<TaskDetailDto>;
    remove(id: number): Promise<void>;
    ensureExists(id: number): Promise<void>;
    private ensureEngagementExists;
    private ensureUserExists;
    private toListItem;
    private toDetail;
}
