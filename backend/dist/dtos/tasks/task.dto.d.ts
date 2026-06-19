import { TaskStatus } from "../common/enums.dto";
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
}
export declare class UpsertTaskDto extends UpdateTaskDto {
    id?: number;
}
export declare class AssignTaskDto {
    assignedToId: number;
}
export declare class CreateTaskCommentDto {
    content: string;
}
export declare class TaskListItemDto {
    id: number;
    engagementId: number;
    engagementTitle: string;
    title: string;
    description: string | null;
    status: string;
    assigneeName: string | null;
    createdAt: Date;
}
export declare class TaskCommentDto {
    id: number;
    authorName: string;
    content: string;
    createdAt: Date;
}
export declare class TaskDetailDto extends TaskListItemDto {
    comments: TaskCommentDto[];
    updatedAt: Date;
}
