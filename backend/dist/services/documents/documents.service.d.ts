import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { CreateDocumentCategoryDto, DocumentCategoryDto, DocumentListItemDto, DocumentLogDto } from "../../dtos/documents/document.dto";
import { DocumentLogAction } from "../../dtos/common/enums.dto";
export declare class DocumentsService {
    private prisma;
    private cache;
    private static readonly CATEGORY_CACHE_KEY;
    private static readonly CATEGORY_TTL_MS;
    constructor(prisma: PrismaService, cache: CacheService);
    findCategories(): Promise<DocumentCategoryDto[]>;
    createCategory(dto: CreateDocumentCategoryDto): Promise<DocumentCategoryDto>;
    findAll(query: PaginationQueryDto, filters?: {
        clientId?: number;
        engagementId?: number;
        categoryId?: number;
    }): Promise<PaginatedResponseDto<DocumentListItemDto>>;
    private buildOrderBy;
    findOne(id: number): Promise<DocumentListItemDto>;
    createRecord(data: {
        clientId: number;
        engagementId?: number;
        categoryId?: number;
        originalName: string;
        storedName: string;
        mimeType: string;
        fileSize: number;
        uploadedByUid: number;
    }): Promise<DocumentListItemDto>;
    logAction(documentId: number, action: DocumentLogAction, performedByUid: number, details?: string): Promise<void>;
    getLogs(documentId: number): Promise<DocumentLogDto[]>;
    remove(id: number, performedByUid: number): Promise<void>;
    ensureExists(id: number): Promise<{
        uid: number;
        createdAt: Date;
        updatedAt: Date;
        clientUid: number;
        engagementUid: number | null;
        originalName: string;
        mimeType: string;
        fileSize: number;
        categoryUid: number | null;
        storedName: string;
        uploadedByUid: number;
    }>;
    private ensureClientExists;
    private ensureEngagementExists;
    private ensureCategoryExists;
    private toListItem;
}
