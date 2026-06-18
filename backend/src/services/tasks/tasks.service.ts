import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import {
  buildPaginatedResponse,
  resolvePagination,
} from "../../common/prisma/pagination.util";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import {
  AssignTaskDto,
  CreateTaskCommentDto,
  CreateTaskDto,
  TaskDetailDto,
  TaskListItemDto,
  UpdateTaskDto,
} from "../../dtos/tasks/task.dto";
import { TaskStatus } from "../../dtos/common/enums.dto";

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findAll(
    query: PaginationQueryDto,
    filters?: {
      engagementId?: number;
      assigneeId?: number;
      status?: string;
    },
  ): Promise<PaginatedResponseDto<TaskListItemDto>> {
    const { page, limit, skip, take } = resolvePagination(query);
    const where = {
      engagementUid: filters?.engagementId,
      status: filters?.status,
      assignments: filters?.assigneeId
        ? { some: { assignedToUid: filters.assigneeId } }
        : undefined,
      ...(query.search?.trim()
        ? {
            OR: [
              { title: { contains: query.search.trim(), mode: "insensitive" as const } },
              { description: { contains: query.search.trim(), mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          engagement: true,
          assignments: {
            include: { assignedTo: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.task.count({ where }),
    ]);

    return buildPaginatedResponse(
      tasks.map((task) => this.toListItem(task)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: number): Promise<TaskDetailDto> {
    const task = await this.prisma.task.findUnique({
      where: { uid: id },
      include: {
        engagement: true,
        assignments: {
          include: { assignedTo: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        comments: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return this.toDetail(task);
  }

  async create(
    engagementId: number,
    dto: CreateTaskDto,
    createdByUid: number,
  ): Promise<TaskListItemDto> {
    await this.ensureEngagementExists(engagementId);

    const task = await this.prisma.task.create({
      data: {
        engagementUid: engagementId,
        title: dto.title,
        description: dto.description,
        status: dto.status ?? TaskStatus.PENDING,
        createdByUid,
      },
      include: {
        engagement: true,
        assignments: { include: { assignedTo: true }, take: 1 },
      },
    });

    return this.toListItem(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<TaskListItemDto> {
    await this.ensureExists(id);

    const task = await this.prisma.task.update({
      where: { uid: id },
      data: dto,
      include: {
        engagement: true,
        assignments: {
          include: { assignedTo: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return this.toListItem(task);
  }

  async assign(
    taskId: number,
    dto: AssignTaskDto,
    assignedByUid: number,
  ): Promise<TaskListItemDto> {
    await this.ensureExists(taskId);
    await this.ensureUserExists(dto.assignedToId);

    await this.prisma.taskAssignment.create({
      data: {
        taskUid: taskId,
        assignedToUid: dto.assignedToId,
        assignedByUid,
      },
    });

    return this.findOne(taskId);
  }

  async addComment(
    taskId: number,
    dto: CreateTaskCommentDto,
    userUid: number,
  ): Promise<TaskDetailDto> {
    await this.ensureExists(taskId);

    await this.prisma.taskComment.create({
      data: {
        taskUid: taskId,
        userUid,
        content: dto.content,
      },
    });

    return this.findOne(taskId);
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.task.delete({ where: { uid: id } });
  }

  async ensureExists(id: number) {
    const task = await this.prisma.task.findUnique({ where: { uid: id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  private async ensureEngagementExists(engagementId: number) {
    const engagement = await this.prisma.auditEngagement.findUnique({
      where: { uid: engagementId },
    });
    if (!engagement) {
      throw new NotFoundException(`Engagement ${engagementId} not found`);
    }
  }

  private async ensureUserExists(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { uid: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
  }

  private toListItem(task: {
    uid: number;
    engagementUid: number;
    title: string;
    description: string | null;
    status: string;
    createdAt: Date;
    engagement: { title: string };
    assignments: { assignedTo: { name: string } }[];
  }): TaskListItemDto {
    return {
      id: task.uid,
      engagementId: task.engagementUid,
      engagementTitle: task.engagement.title,
      title: task.title,
      description: task.description,
      status: task.status,
      assigneeName: task.assignments[0]?.assignedTo.name ?? null,
      createdAt: task.createdAt,
    };
  }

  private toDetail(task: {
    uid: number;
    engagementUid: number;
    title: string;
    description: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    engagement: { title: string };
    assignments: { assignedTo: { name: string } }[];
    comments: { uid: number; content: string; createdAt: Date; user: { name: string } }[];
  }): TaskDetailDto {
    return {
      ...this.toListItem(task),
      updatedAt: task.updatedAt,
      comments: task.comments.map((comment) => ({
        id: comment.uid,
        authorName: comment.user.name,
        content: comment.content,
        createdAt: comment.createdAt,
      })),
    };
  }
}
