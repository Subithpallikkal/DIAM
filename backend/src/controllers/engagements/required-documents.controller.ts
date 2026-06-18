import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  CreateRequiredDocumentDto,
  RequiredDocumentListItemDto,
  UpdateRequiredDocumentDto,
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
  @ApiOperation({ summary: "Add a required document checklist item" })
  @ApiParam({ name: "id", type: Number, example: 1, description: "Engagement id" })
  @ApiBody({
    type: CreateRequiredDocumentDto,
    description: "Checklist item details",
    examples: {
      default: SwaggerExamples.requiredDocuments.create,
    },
  })
  @ApiCreatedResponse({
    description: "Checklist item created",
    type: RequiredDocumentListItemDto,
    schema: { example: SwaggerExamples.requiredDocuments.listItem },
  })
  @ApiStandardErrors()
  create(
    @Param("id", ParseIntPipe) engagementId: number,
    @Body() dto: CreateRequiredDocumentDto,
  ) {
    return this.requiredDocumentsService.create(engagementId, dto);
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

  @RequireRoles(...Roles.ALL)
  @Patch(":docId")
  @ApiOperation({ summary: "Update a checklist item (e.g. mark as received)" })
  @ApiParam({ name: "id", type: Number, example: 1, description: "Engagement id" })
  @ApiParam({ name: "docId", type: Number, example: 1 })
  @ApiBody({
    type: UpdateRequiredDocumentDto,
    description: "Fields to update",
    examples: {
      markReceived: SwaggerExamples.requiredDocuments.updateReceived,
    },
  })
  @ApiOkResponse({
    description: "Checklist item updated",
    type: RequiredDocumentListItemDto,
    schema: {
      example: { ...SwaggerExamples.requiredDocuments.listItem, isReceived: true },
    },
  })
  @ApiStandardErrors()
  update(
    @Param("id", ParseIntPipe) engagementId: number,
    @Param("docId", ParseIntPipe) docId: number,
    @Body() dto: UpdateRequiredDocumentDto,
  ) {
    return this.requiredDocumentsService.update(engagementId, docId, dto);
  }
}
