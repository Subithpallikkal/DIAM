import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { TasksService } from "../../services/tasks/tasks.service";
import {
  AssignTaskDto,
  CreateTaskCommentDto,
  TaskDetailDto,
  TaskListItemDto,
  UpsertTaskDto,
} from "../../dtos/tasks/task.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
import { PaginatedTasksResponseDto } from "../../dtos/common/paginated-responses.dto";

@ApiTags("Tasks")
@ApiBearerAuth("JWT")
@Controller()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @RequireRoles(...Roles.ALL)
  @Get("tasks")
  @ApiOperation({ summary: "List tasks" })
  @ApiQuery({ name: "engagementId", required: false, type: Number })
  @ApiQuery({ name: "assigneeId", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiOkResponse({
    description: "Paginated task list",
    type: PaginatedTasksResponseDto,
    schema: { example: SwaggerExamples.tasks.paginated },
  })
  findAll(
    @Query() query: PaginationQueryDto,
    @Query("engagementId") engagementId?: string,
    @Query("assigneeId") assigneeId?: string,
    @Query("status") status?: string,
  ) {
    return this.tasksService.findAll(query, {
      engagementId: engagementId ? Number(engagementId) : undefined,
      assigneeId: assigneeId ? Number(assigneeId) : undefined,
      status,
    });
  }

  @RequireRoles(...Roles.ALL)
  @Get("tasks/:id")
  @ApiOperation({ summary: "Get task details" })
  @ApiOkResponse({
    type: TaskDetailDto,
    schema: { example: SwaggerExamples.tasks.detail },
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("engagements/:engagementId/tasks")
  @ApiOperation({ summary: "Create or update task for engagement" })
  @ApiBody({
    type: UpsertTaskDto,
    examples: {
      create: SwaggerExamples.tasks.create,
      update: SwaggerExamples.tasks.update,
    },
  })
  @ApiCreatedResponse({
    type: TaskListItemDto,
    schema: { example: SwaggerExamples.tasks.listItem },
  })
  @ApiStandardErrors()
  upsert(
    @Param("engagementId", ParseIntPipe) engagementId: number,
    @Body() dto: UpsertTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.upsert(engagementId, dto, user.sub);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("tasks/:id/assign")
  @ApiOperation({ summary: "Assign task to user" })
  @ApiBody({ type: AssignTaskDto, examples: { default: SwaggerExamples.tasks.assign } })
  @ApiOkResponse({
    type: TaskDetailDto,
    schema: { example: SwaggerExamples.tasks.detail },
  })
  @ApiStandardErrors()
  assign(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.assign(id, dto, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Post("tasks/:id/comments")
  @ApiOperation({ summary: "Add comment to task" })
  @ApiBody({ type: CreateTaskCommentDto, examples: { default: SwaggerExamples.tasks.comment } })
  @ApiOkResponse({
    type: TaskDetailDto,
    schema: { example: SwaggerExamples.tasks.detail },
  })
  @ApiStandardErrors()
  addComment(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateTaskCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.addComment(id, dto, user.sub);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Delete("tasks/:id")
  @ApiOperation({ summary: "Delete task" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
