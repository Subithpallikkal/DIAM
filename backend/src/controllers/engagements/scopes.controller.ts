import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { ScopesService } from "../../services/engagements/scopes.service";
import {
  CreateScopeDto,
  ScopeListItemDto,
} from "../../dtos/engagements/engagement.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";

@ApiTags("Engagement Scopes")
@ApiBearerAuth("JWT")
@Controller("engagements/:id/scopes")
export class ScopesController {
  constructor(private scopesService: ScopesService) {}

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post()
  @ApiOperation({ summary: "Add a scope item to an engagement" })
  @ApiParam({ name: "id", type: Number, example: 1, description: "Engagement id" })
  @ApiBody({
    type: CreateScopeDto,
    description: "Scope item details",
    examples: {
      default: SwaggerExamples.scopes.create,
    },
  })
  @ApiCreatedResponse({
    description: "Scope created",
    type: ScopeListItemDto,
    schema: { example: SwaggerExamples.scopes.listItem },
  })
  @ApiStandardErrors()
  create(
    @Param("id", ParseIntPipe) engagementId: number,
    @Body() dto: CreateScopeDto,
  ) {
    return this.scopesService.create(engagementId, dto);
  }

  @RequireRoles(...Roles.ALL)
  @Get()
  @ApiOperation({ summary: "List scope items for an engagement" })
  @ApiParam({ name: "id", type: Number, example: 1, description: "Engagement id" })
  @ApiOkResponse({
    description: "List of scopes",
    type: [ScopeListItemDto],
    schema: { example: SwaggerExamples.scopes.list },
  })
  @ApiResponse({
    status: 404,
    description: "Engagement not found",
    schema: { example: SwaggerExamples.errors.notFound },
  })
  findAll(@Param("id", ParseIntPipe) engagementId: number) {
    return this.scopesService.findAll(engagementId);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Delete(":scopeId")
  @ApiOperation({ summary: "Remove a scope item from an engagement" })
  @ApiParam({ name: "id", type: Number, example: 1, description: "Engagement id" })
  @ApiParam({ name: "scopeId", type: Number, example: 1 })
  @ApiOkResponse({ description: "Scope removed" })
  @ApiResponse({
    status: 404,
    description: "Scope not found",
    schema: { example: SwaggerExamples.errors.notFound },
  })
  remove(
    @Param("id", ParseIntPipe) engagementId: number,
    @Param("scopeId", ParseIntPipe) scopeId: number,
  ) {
    return this.scopesService.remove(engagementId, scopeId);
  }
}
