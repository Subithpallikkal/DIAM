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
import { RisksService } from "../../services/risks/risks.service";
import {
  AssignChecklistDto,
  ChecklistItemDto,
  CreateChecklistItemDto,
  CreateRiskDto,
  RiskListItemDto,
  UpdateChecklistItemDto,
  UpdateRiskDto,
} from "../../dtos/risks/risk.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";

@ApiTags("Risks")
@ApiBearerAuth("JWT")
@Controller()
export class RisksController {
  constructor(private risksService: RisksService) {}

  @RequireRoles(...Roles.ALL)
  @Get("risks")
  @ApiOperation({ summary: "List risks" })
  @ApiQuery({ name: "engagementId", required: false, type: Number })
  @ApiOkResponse({ type: [RiskListItemDto] })
  findAll(
    @Query() query: PaginationQueryDto,
    @Query("engagementId") engagementId?: string,
  ) {
    return this.risksService.findAll(
      query,
      engagementId ? Number(engagementId) : undefined,
    );
  }

  @RequireRoles(...Roles.ALL)
  @Get("risks/:id")
  @ApiOperation({ summary: "Get risk details" })
  @ApiParam({ name: "id", type: Number })
  @ApiOkResponse({ type: RiskListItemDto })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.risksService.findOne(id);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("engagements/:engagementId/risks")
  @ApiOperation({ summary: "Create risk for engagement" })
  @ApiParam({ name: "engagementId", type: Number })
  @ApiCreatedResponse({ type: RiskListItemDto })
  @ApiStandardErrors()
  create(
    @Param("engagementId", ParseIntPipe) engagementId: number,
    @Body() dto: CreateRiskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.risksService.create(engagementId, dto, user.sub);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Patch("risks/:id")
  @ApiOperation({ summary: "Update risk" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateRiskDto) {
    return this.risksService.update(id, dto);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Delete("risks/:id")
  @ApiOperation({ summary: "Delete risk" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.risksService.remove(id);
  }

  @RequireRoles(...Roles.ALL)
  @Get("risks/:id/checklists")
  @ApiOperation({ summary: "List checklist items for risk" })
  @ApiOkResponse({ type: [ChecklistItemDto] })
  findChecklists(@Param("id", ParseIntPipe) id: number) {
    return this.risksService.findChecklists(id);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("risks/:id/checklists")
  @ApiOperation({ summary: "Add checklist item" })
  @ApiCreatedResponse({ type: ChecklistItemDto })
  addChecklist(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.risksService.addChecklistItem(id, dto);
  }

  @RequireRoles(...Roles.ALL)
  @Patch("risks/:id/checklists/:checklistId")
  @ApiOperation({ summary: "Update checklist item" })
  updateChecklist(
    @Param("id", ParseIntPipe) id: number,
    @Param("checklistId", ParseIntPipe) checklistId: number,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.risksService.updateChecklistItem(id, checklistId, dto);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("risks/:id/checklists/:checklistId/assign")
  @ApiOperation({ summary: "Assign checklist item to user" })
  assignChecklist(
    @Param("id", ParseIntPipe) id: number,
    @Param("checklistId", ParseIntPipe) checklistId: number,
    @Body() dto: AssignChecklistDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.risksService.assignChecklistItem(
      id,
      checklistId,
      dto,
      user.sub,
    );
  }
}
