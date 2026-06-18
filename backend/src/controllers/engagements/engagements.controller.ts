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
  CreateEngagementDto,
  EngagementDetailDto,
  EngagementListItemDto,
  UpdateEngagementDto,
} from "../../dtos/engagements/engagement.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";

@ApiTags("Engagements")
@ApiBearerAuth("JWT")
@Controller("engagements")
export class EngagementsController {
  constructor(private engagementsService: EngagementsService) {}

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post()
  @ApiOperation({ summary: "Create a new audit engagement" })
  @ApiBody({
    type: CreateEngagementDto,
    description: "Engagement details",
    examples: {
      default: SwaggerExamples.engagements.create,
    },
  })
  @ApiCreatedResponse({
    description: "Engagement created",
    type: EngagementDetailDto,
    schema: { example: SwaggerExamples.engagements.detail },
  })
  @ApiStandardErrors()
  create(@Body() dto: CreateEngagementDto, @CurrentUser() user: JwtPayload) {
    return this.engagementsService.create(dto, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Get()
  @ApiOperation({ summary: "List audit engagements (paginated)" })
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

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Patch(":id")
  @ApiOperation({ summary: "Update an audit engagement" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiBody({
    type: UpdateEngagementDto,
    description: "Fields to update",
    examples: {
      default: SwaggerExamples.engagements.update,
    },
  })
  @ApiOkResponse({
    description: "Engagement updated",
    type: EngagementDetailDto,
    schema: { example: SwaggerExamples.engagements.detail },
  })
  @ApiStandardErrors()
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateEngagementDto,
  ) {
    return this.engagementsService.update(id, dto);
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
