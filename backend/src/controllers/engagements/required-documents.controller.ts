import {
  Body,
  Controller,
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
import { RequiredDocumentsService } from "../../services/engagements/required-documents.service";
import {
  RequiredDocumentListItemDto,
  UpsertRequiredDocumentDto,
} from "../../dtos/engagements/engagement.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";

@ApiTags("Required Documents")
@ApiBearerAuth("JWT")
@Controller("engagements/:id/required-documents")
export class RequiredDocumentsController {
  constructor(private requiredDocumentsService: RequiredDocumentsService) {}

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post()
  @ApiOperation({ summary: "Create or update a required document checklist item" })
  @ApiParam({ name: "id", type: Number, example: 1, description: "Engagement id" })
  @ApiBody({
    type: UpsertRequiredDocumentDto,
    description: "Include id to update; omit id to create",
    examples: {
      create: SwaggerExamples.requiredDocuments.create,
      update: SwaggerExamples.requiredDocuments.updateReceived,
    },
  })
  @ApiCreatedResponse({
    description: "Checklist item saved",
    type: RequiredDocumentListItemDto,
    schema: { example: SwaggerExamples.requiredDocuments.listItem },
  })
  @ApiStandardErrors()
  upsert(
    @Param("id", ParseIntPipe) engagementId: number,
    @Body() dto: UpsertRequiredDocumentDto,
  ) {
    return this.requiredDocumentsService.upsert(engagementId, dto);
  }

  @RequireRoles(...Roles.ALL)
  @Get()
  @ApiOperation({ summary: "List required document checklist items" })
  @ApiParam({ name: "id", type: Number, example: 1, description: "Engagement id" })
  @ApiOkResponse({
    description: "List of checklist items",
    type: [RequiredDocumentListItemDto],
    schema: { example: SwaggerExamples.requiredDocuments.list },
  })
  @ApiResponse({
    status: 404,
    description: "Engagement not found",
    schema: { example: SwaggerExamples.errors.notFound },
  })
  findAll(@Param("id", ParseIntPipe) engagementId: number) {
    return this.requiredDocumentsService.findAll(engagementId);
  }
}
