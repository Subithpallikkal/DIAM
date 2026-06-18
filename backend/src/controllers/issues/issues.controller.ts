import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
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
  CreateFindingDto,
  CreateIssueDto,
  FindingDto,
  IssueDetailDto,
  IssueListItemDto,
  UpdateIssueDto,
} from "../../dtos/issues/issue.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";

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
  @ApiOkResponse({ type: [IssueListItemDto] })
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
  @ApiOkResponse({ type: IssueDetailDto })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.issuesService.findOne(id);
  }

  @RequireRoles(...Roles.ALL)
  @Post("engagements/:engagementId/issues")
  @ApiOperation({ summary: "Create issue for engagement" })
  @ApiCreatedResponse({ type: IssueListItemDto })
  @ApiStandardErrors()
  create(
    @Param("engagementId", ParseIntPipe) engagementId: number,
    @Body() dto: CreateIssueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.issuesService.create(engagementId, dto, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Patch("issues/:id")
  @ApiOperation({ summary: "Update issue" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateIssueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.issuesService.update(id, dto, user.sub);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("issues/:id/assign")
  @ApiOperation({ summary: "Assign issue to user" })
  assign(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AssignIssueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.issuesService.assign(id, dto, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Post("issues/:id/findings")
  @ApiOperation({ summary: "Add finding to issue" })
  @ApiCreatedResponse({ type: FindingDto })
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
