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
import { RisksService } from "../../services/risks/risks.service";
import {
  AssignChecklistDto,
  ChecklistItemDto,
  RiskListItemDto,
  UpsertChecklistItemDto,
  UpsertRiskDto,
} from "../../dtos/risks/risk.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
import { PaginatedRisksResponseDto } from "../../dtos/common/paginated-responses.dto";

@ApiTags("Risks")
@ApiBearerAuth("JWT")
@Controller()
export class RisksController {
  constructor(private risksService: RisksService) {}

  @RequireRoles(...Roles.ALL)
  @Get("risks")
  @ApiOperation({ summary: "List risks" })
  @ApiQuery({ name: "engagementId", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated risk list",
    type: PaginatedRisksResponseDto,
    schema: { example: SwaggerExamples.risks.paginated },
  })
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
  @ApiOkResponse({
    type: RiskListItemDto,
    schema: { example: SwaggerExamples.risks.listItem },
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.risksService.findOne(id);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("engagements/:engagementId/risks")
  @ApiOperation({ summary: "Create or update risk for engagement" })
  @ApiParam({ name: "engagementId", type: Number })
  @ApiBody({
    type: UpsertRiskDto,
    examples: {
      create: SwaggerExamples.risks.create,
      update: SwaggerExamples.risks.update,
    },
  })
  @ApiCreatedResponse({
    type: RiskListItemDto,
    schema: { example: SwaggerExamples.risks.listItem },
  })
  @ApiStandardErrors()
  upsert(
    @Param("engagementId", ParseIntPipe) engagementId: number,
    @Body() dto: UpsertRiskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.risksService.upsert(engagementId, dto, user.sub);
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
  @ApiOkResponse({
    type: [ChecklistItemDto],
    schema: { example: SwaggerExamples.risks.checklistList },
  })
  findChecklists(@Param("id", ParseIntPipe) id: number) {
    return this.risksService.findChecklists(id);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("risks/:id/checklists")
  @ApiOperation({ summary: "Create or update checklist item" })
  @ApiBody({
    type: UpsertChecklistItemDto,
    examples: {
      create: SwaggerExamples.risks.checklistCreate,
      update: SwaggerExamples.risks.checklistUpdate,
    },
  })
  @ApiCreatedResponse({
    type: ChecklistItemDto,
    schema: { example: SwaggerExamples.risks.checklistItem },
  })
  @ApiStandardErrors()
  upsertChecklist(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpsertChecklistItemDto,
  ) {
    return this.risksService.upsertChecklistItem(id, dto);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("risks/:id/checklists/:checklistId/assign")
  @ApiOperation({ summary: "Assign checklist item to user" })
  @ApiBody({
    type: AssignChecklistDto,
    examples: { default: SwaggerExamples.risks.assignChecklist },
  })
  @ApiOkResponse({
    type: ChecklistItemDto,
    schema: { example: SwaggerExamples.risks.checklistItem },
  })
  @ApiStandardErrors()
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
