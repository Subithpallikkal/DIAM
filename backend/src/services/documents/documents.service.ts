import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import {
  buildPaginatedResponse,
  resolvePagination,
  resolveSortDirection,
} from "../../common/prisma/pagination.util";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import {
  CreateDocumentCategoryDto,
  DocumentCategoryDto,
  DocumentListItemDto,
  DocumentLogDto,
} from "../../dtos/documents/document.dto";
import { DocumentLogAction } from "../../dtos/common/enums.dto";

@Injectable()
export class DocumentsService {
  private static readonly CATEGORY_CACHE_KEY = "documents:categories";
  private static readonly CATEGORY_TTL_MS = 5 * 60 * 1000;

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findCategories(): Promise<DocumentCategoryDto[]> {
    const cached = this.cache.get<DocumentCategoryDto[]>(
      DocumentsService.CATEGORY_CACHE_KEY,
    );
    if (cached) return cached;

    const categories = await this.prisma.documentCategory.findMany({
      orderBy: { name: "asc" },
    });

    const result = categories.map((category) => ({
      id: category.uid,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
    }));

    this.cache.set(
      DocumentsService.CATEGORY_CACHE_KEY,
      result,
      DocumentsService.CATEGORY_TTL_MS,
    );

    return result;
  }

  async createCategory(dto: CreateDocumentCategoryDto): Promise<DocumentCategoryDto> {
    const category = await this.prisma.documentCategory.create({ data: dto });
    this.cache.delete(DocumentsService.CATEGORY_CACHE_KEY);

    return {
      id: category.uid,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
    };
  }

  async findAll(
    query: PaginationQueryDto,
    filters?: {
      clientId?: number;
      engagementId?: number;
      categoryId?: number;
    },
  ): Promise<PaginatedResponseDto<DocumentListItemDto>> {
    const { page, limit, skip, take } = resolvePagination(query);
    const where = {
      clientUid: filters?.clientId,
      engagementUid: filters?.engagementId,
      categoryUid: filters?.categoryId,
      ...(query.search?.trim()
        ? { originalName: { contains: query.search.trim(), mode: "insensitive" as const } }
        : {}),
    };

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        include: {
          client: true,
          engagement: true,
          category: true,
          uploadedBy: true,
        },
        orderBy: this.buildOrderBy(query),
        skip,
        take,
      }),
      this.prisma.document.count({ where }),
    ]);

    return buildPaginatedResponse(
      documents.map((doc) => this.toListItem(doc)),
      total,
      page,
      limit,
    );
  }

  private buildOrderBy(query: PaginationQueryDto): Prisma.DocumentOrderByWithRelationInput {
    const direction = resolveSortDirection(query);

    switch (query.sortBy) {
      case "originalName":
        return { originalName: direction };
      case "clientName":
        return { client: { name: direction } };
      case "engagementTitle":
        return { engagement: { title: direction } };
      case "categoryName":
        return { category: { name: direction } };
      case "fileSize":
        return { fileSize: direction };
      case "createdAt":
        return { createdAt: direction };
      default:
        return { createdAt: "desc" };
    }
  }

  async findOne(id: number): Promise<DocumentListItemDto> {
    const document = await this.prisma.document.findUnique({
      where: { uid: id },
      include: {
        client: true,
        engagement: true,
        category: true,
        uploadedBy: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Document ${id} not found`);
    }

    return this.toListItem(document);
  }

  async createRecord(data: {
    clientId: number;
    engagementId?: number;
    categoryId?: number;
    originalName: string;
    storedName: string;
    mimeType: string;
    fileSize: number;
    uploadedByUid: number;
  }): Promise<DocumentListItemDto> {
    await this.ensureClientExists(data.clientId);

    if (data.engagementId) {
      await this.ensureEngagementExists(data.engagementId);
    }

    if (data.categoryId) {
      await this.ensureCategoryExists(data.categoryId);
    }

    const document = await this.prisma.document.create({
      data: {
        clientUid: data.clientId,
        engagementUid: data.engagementId,
        categoryUid: data.categoryId,
        originalName: data.originalName,
        storedName: data.storedName,
        mimeType: data.mimeType,
        fileSize: data.fileSize,
        uploadedByUid: data.uploadedByUid,
      },
      include: {
        client: true,
        engagement: true,
        category: true,
        uploadedBy: true,
      },
    });

    await this.logAction(document.uid, DocumentLogAction.UPLOAD, data.uploadedByUid);

    return this.toListItem(document);
  }

  async logAction(
    documentId: number,
    action: DocumentLogAction,
    performedByUid: number,
    details?: string,
  ): Promise<void> {
    await this.ensureExists(documentId);

    await this.prisma.documentLog.create({
      data: {
        documentUid: documentId,
        action,
        performedByUid,
        details,
      },
    });
  }

  async getLogs(documentId: number): Promise<DocumentLogDto[]> {
    await this.ensureExists(documentId);

    const logs = await this.prisma.documentLog.findMany({
      where: { documentUid: documentId },
      include: { performedBy: true },
      orderBy: { createdAt: "desc" },
    });

    return logs.map((log) => ({
      id: log.uid,
      action: log.action,
      performedByName: log.performedBy.name,
      details: log.details,
      createdAt: log.createdAt,
    }));
  }

  async remove(id: number, performedByUid: number): Promise<void> {
    const document = await this.prisma.document.findUnique({
      where: { uid: id },
    });

    if (!document) {
      throw new NotFoundException(`Document ${id} not found`);
    }

    await this.logAction(id, DocumentLogAction.DELETE, performedByUid);
    await this.prisma.document.delete({ where: { uid: id } });

    return;
  }

  async ensureExists(id: number) {
    const document = await this.prisma.document.findUnique({
      where: { uid: id },
    });

    if (!document) {
      throw new NotFoundException(`Document ${id} not found`);
    }

    return document;
  }

  private async ensureClientExists(clientId: number) {
    const client = await this.prisma.client.findUnique({
      where: { uid: clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client ${clientId} not found`);
    }
  }

  private async ensureEngagementExists(engagementId: number) {
    const engagement = await this.prisma.auditEngagement.findUnique({
      where: { uid: engagementId },
    });

    if (!engagement) {
      throw new NotFoundException(`Engagement ${engagementId} not found`);
    }
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.documentCategory.findUnique({
      where: { uid: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }
  }

  private toListItem(document: {
    uid: number;
    clientUid: number;
    engagementUid: number | null;
    categoryUid: number | null;
    originalName: string;
    mimeType: string;
    fileSize: number;
    createdAt: Date;
    client: { name: string };
    engagement: { title: string } | null;
    category: { name: string } | null;
    uploadedBy: { name: string };
  }): DocumentListItemDto {
    return {
      id: document.uid,
      clientId: document.clientUid,
      clientName: document.client.name,
      engagementId: document.engagementUid,
      engagementTitle: document.engagement?.title ?? null,
      categoryId: document.categoryUid,
      categoryName: document.category?.name ?? null,
      originalName: document.originalName,
      mimeType: document.mimeType,
      fileSize: document.fileSize,
      uploadedByName: document.uploadedBy.name,
      createdAt: document.createdAt,
    };
  }
}
