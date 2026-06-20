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
import { ClientsService } from "../../services/clients/clients.service";
import {
  ClientDetailDto,
  ClientListItemDto,
  UpsertClientDto,
} from "../../dtos/clients/client.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
import { PaginatedClientsResponseDto } from "../../dtos/common/paginated-responses.dto";

@ApiTags("Clients")
@ApiBearerAuth("JWT")
@Controller("clients")
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post()
  @ApiOperation({ summary: "Create or update a client" })
  @ApiBody({
    type: UpsertClientDto,
    description: "Include id to update; omit id to create",
    examples: {
      create: SwaggerExamples.clients.create,
      update: SwaggerExamples.clients.update,
    },
  })
  @ApiCreatedResponse({
    description: "Client saved",
    type: ClientDetailDto,
    schema: { example: SwaggerExamples.clients.detail },
  })
  @ApiStandardErrors()
  upsert(@Body() dto: UpsertClientDto, @CurrentUser() user: JwtPayload) {
    return this.clientsService.upsert(dto, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Get()
  @ApiOperation({ summary: "List clients (paginated)" })
  @ApiOkResponse({
    description: "Paginated client list",
    type: PaginatedClientsResponseDto,
    schema: { example: SwaggerExamples.clients.paginated },
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.clientsService.findAll(query);
  }

  @RequireRoles(...Roles.ALL)
  @Get(":id")
  @ApiOperation({ summary: "Get client details by id" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiOkResponse({
    description: "Client details",
    type: ClientDetailDto,
    schema: { example: SwaggerExamples.clients.detail },
  })
  @ApiResponse({
    status: 404,
    description: "Client not found",
    schema: { example: SwaggerExamples.errors.notFound },
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @RequireRoles(...Roles.ADMIN_ONLY)
  @Delete(":id")
  @ApiOperation({ summary: "Soft delete (deactivate) a client" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiOkResponse({
    description: "Client deactivated",
    type: ClientDetailDto,
    schema: {
      example: { ...SwaggerExamples.clients.detail, isActive: false },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Client not found",
    schema: { example: SwaggerExamples.errors.notFound },
  })
  deactivate(@Param("id", ParseIntPipe) id: number) {
    return this.clientsService.deactivate(id);
  }
}
