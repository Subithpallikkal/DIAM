import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { DocumentsService } from "../../services/documents/documents.service";
import { DocumentStorageService } from "../../services/documents/document-storage.service";
import {
  CreateDocumentCategoryDto,
  DocumentCategoryDto,
  DocumentListItemDto,
  DocumentLogDto,
} from "../../dtos/documents/document.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";

@ApiTags("Documents")
@ApiBearerAuth("JWT")
@Controller("documents")
export class DocumentsController {
  constructor(
    private documentsService: DocumentsService,
    private storageService: DocumentStorageService,
  ) {}

  @RequireRoles(...Roles.ALL)
  @Get("categories")
  @ApiOperation({ summary: "List document categories" })
  @ApiOkResponse({ type: [DocumentCategoryDto] })
  findCategories() {
    return this.documentsService.findCategories();
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Post("categories")
  @ApiOperation({ summary: "Create document category" })
  @ApiCreatedResponse({ type: DocumentCategoryDto })
  createCategory(@Body() dto: CreateDocumentCategoryDto) {
    return this.documentsService.createCategory(dto);
  }

  @RequireRoles(...Roles.ALL)
  @Get()
  @ApiOperation({ summary: "List uploaded documents" })
  @ApiQuery({ name: "clientId", required: false, type: Number })
  @ApiQuery({ name: "engagementId", required: false, type: Number })
  @ApiQuery({ name: "categoryId", required: false, type: Number })
  @ApiOkResponse({ type: [DocumentListItemDto] })
  findAll(
    @Query() query: PaginationQueryDto,
    @Query("clientId") clientId?: string,
    @Query("engagementId") engagementId?: string,
    @Query("categoryId") categoryId?: string,
  ) {
    return this.documentsService.findAll(query, {
      clientId: clientId ? Number(clientId) : undefined,
      engagementId: engagementId ? Number(engagementId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
    });
  }

  @RequireRoles(...Roles.ALL)
  @Post("upload")
  @ApiOperation({ summary: "Upload a document file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        clientId: { type: "number" },
        engagementId: { type: "number" },
        categoryId: { type: "number" },
      },
      required: ["file", "clientId"],
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiCreatedResponse({ type: DocumentListItemDto })
  @ApiStandardErrors()
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body("clientId") clientId: string,
    @Body("engagementId") engagementId: string | undefined,
    @Body("categoryId") categoryId: string | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.storageService.upload(file, {
      clientId: Number(clientId),
      engagementId: engagementId ? Number(engagementId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      uploadedByUid: user.sub,
    });
  }

  @RequireRoles(...Roles.ALL)
  @Get(":id/versions")
  @ApiOperation({ summary: "List all versions of a document" })
  @ApiOkResponse({ type: [DocumentListItemDto] })
  findVersions(@Param("id", ParseIntPipe) id: number) {
    return this.documentsService.findVersions(id);
  }

  @RequireRoles(...Roles.ALL)
  @Post(":id/versions/upload")
  @ApiOperation({ summary: "Upload a new version of an existing document" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
      required: ["file"],
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiCreatedResponse({ type: DocumentListItemDto })
  @ApiStandardErrors()
  uploadVersion(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.storageService.uploadVersion(id, file, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Get(":id")
  @ApiOperation({ summary: "Get document metadata" })
  @ApiParam({ name: "id", type: Number })
  @ApiOkResponse({ type: DocumentListItemDto })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @RequireRoles(...Roles.ALL)
  @Get(":id/download")
  @ApiOperation({ summary: "Download document file" })
  download(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.storageService.download(id, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Get(":id/view")
  @ApiOperation({ summary: "View document inline" })
  view(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.storageService.view(id, user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Get(":id/logs")
  @ApiOperation({ summary: "Get document audit trail" })
  @ApiOkResponse({ type: [DocumentLogDto] })
  getLogs(@Param("id", ParseIntPipe) id: number) {
    return this.documentsService.getLogs(id);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Delete(":id")
  @ApiOperation({ summary: "Delete document" })
  remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.storageService.deleteFile(id, user.sub);
  }
}
