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
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { EngagementsService } from "../../services/engagements/engagements.service";
import {
  EngagementDetailDto,
  EngagementListItemDto,
  UpsertEngagementDto,
} from "../../dtos/engagements/engagement.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
import { PaginatedEngagementsResponseDto } from "../../dtos/common/paginated-responses.dto";

@ApiTags("Engagements")
@ApiBearerAuth("JWT")
@Controller("engagements")
export class EngagementsController {
  constructor(private engagementsService: EngagementsService) {}

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post()
  @ApiOperation({ summary: "Create or update an audit engagement" })
  @ApiBody({
    type: UpsertEngagementDto,
    description: "Include id to update; omit id to create",
    examples: {
      create: SwaggerExamples.engagements.create,
      update: SwaggerExamples.engagements.update,
    },
  })
  @ApiCreatedResponse({
    description: "Engagement saved",
    type: EngagementDetailDto,
    schema: { example: SwaggerExamples.engagements.detail },
  })
  @ApiStandardErrors()
  upsert(@Body() dto: UpsertEngagementDto, @CurrentUser() user: JwtPayload) {
    return this.engagementsService.upsert(dto, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Get()
  @ApiOperation({ summary: "List audit engagements (paginated)" })
  @ApiOkResponse({
    description: "Paginated engagement list",
    type: PaginatedEngagementsResponseDto,
    schema: { example: SwaggerExamples.engagements.paginated },
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.engagementsService.findAll(query);
  }

  @RequireRoles(...Roles.ALL)
  @Get(":id")
  @ApiOperation({ summary: "Get engagement details by id" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiOkResponse({
    description: "Engagement details",
    type: EngagementDetailDto,
    schema: { example: SwaggerExamples.engagements.detail },
  })
  @ApiResponse({
    status: 404,
    description: "Engagement not found",
    schema: { example: SwaggerExamples.errors.notFound },
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.engagementsService.findOne(id);
  }

  @RequireRoles(...Roles.ADMIN_ONLY)
  @Delete(":id")
  @ApiOperation({ summary: "Delete an audit engagement" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiOkResponse({ description: "Engagement deleted" })
  @ApiResponse({
    status: 404,
    description: "Engagement not found",
    schema: { example: SwaggerExamples.errors.notFound },
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.engagementsService.remove(id);
  }
}
