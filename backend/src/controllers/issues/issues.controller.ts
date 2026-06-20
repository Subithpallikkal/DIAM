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
import { IssuesService } from "../../services/issues/issues.service";
import {
  AssignIssueDto,
  AssignIssueClientDto,
  CreateFindingDto,
  FindingDto,
  IssueDetailDto,
  IssueListItemDto,
  UpsertIssueDto,
} from "../../dtos/issues/issue.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
import { PaginatedIssuesResponseDto } from "../../dtos/common/paginated-responses.dto";

@ApiTags("Issues")
@ApiBearerAuth("JWT")
@Controller()
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @RequireRoles(...Roles.ALL)
  @Get("issues")
  @ApiOperation({ summary: "List issues" })
  @ApiQuery({ name: "engagementId", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiOkResponse({
    description: "Paginated issue list",
    type: PaginatedIssuesResponseDto,
    schema: { example: SwaggerExamples.issues.paginated },
  })
  findAll(
    @Query() query: PaginationQueryDto,
    @Query("engagementId") engagementId?: string,
    @Query("status") status?: string,
  ) {
    return this.issuesService.findAll(query, {
      engagementId: engagementId ? Number(engagementId) : undefined,
      status,
    });
  }

  @RequireRoles(...Roles.ALL)
  @Get("issues/:id")
  @ApiOperation({ summary: "Get issue details" })
  @ApiOkResponse({
    type: IssueDetailDto,
    schema: { example: SwaggerExamples.issues.detail },
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.issuesService.findOne(id);
  }

  @RequireRoles(...Roles.ALL)
  @Post("engagements/:engagementId/issues")
  @ApiOperation({ summary: "Create or update issue for engagement" })
  @ApiBody({
    type: UpsertIssueDto,
    examples: {
      create: SwaggerExamples.issues.create,
      update: SwaggerExamples.issues.update,
    },
  })
  @ApiCreatedResponse({
    type: IssueListItemDto,
    schema: { example: SwaggerExamples.issues.listItem },
  })
  @ApiStandardErrors()
  upsert(
    @Param("engagementId", ParseIntPipe) engagementId: number,
    @Body() dto: UpsertIssueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.issuesService.upsert(engagementId, dto, user.sub);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("issues/:id/assign")
  @ApiOperation({ summary: "Assign issue to user" })
  @ApiBody({ type: AssignIssueDto, examples: { default: SwaggerExamples.issues.assign } })
  @ApiOkResponse({
    type: IssueDetailDto,
    schema: { example: SwaggerExamples.issues.detail },
  })
  @ApiStandardErrors()
  assign(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AssignIssueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.issuesService.assign(id, dto, user.sub);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("issues/:id/assign-client")
  @ApiOperation({ summary: "Assign issue to client" })
  @ApiBody({
    type: AssignIssueClientDto,
    examples: { default: SwaggerExamples.issues.assignClient },
  })
  @ApiOkResponse({
    type: IssueDetailDto,
    schema: { example: SwaggerExamples.issues.detail },
  })
  @ApiStandardErrors()
  assignClient(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AssignIssueClientDto,
  ) {
    return this.issuesService.assignClient(id, dto);
  }

  @RequireRoles(...Roles.ALL)
  @Post("issues/:id/findings")
  @ApiOperation({ summary: "Add finding to issue" })
  @ApiBody({ type: CreateFindingDto, examples: { default: SwaggerExamples.issues.finding } })
  @ApiCreatedResponse({
    type: FindingDto,
    schema: { example: SwaggerExamples.issues.findingItem },
  })
  @ApiStandardErrors()
  addFinding(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateFindingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.issuesService.addFinding(id, dto, user.sub);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Delete("issues/:id")
  @ApiOperation({ summary: "Delete issue" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.issuesService.remove(id);
  }
}
