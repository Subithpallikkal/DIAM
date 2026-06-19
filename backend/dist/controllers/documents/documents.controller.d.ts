import { StreamableFile } from "@nestjs/common";
import { DocumentsService } from "../../services/documents/documents.service";
import { DocumentStorageService } from "../../services/documents/document-storage.service";
import { CreateDocumentCategoryDto, DocumentCategoryDto, DocumentListItemDto, DocumentLogDto } from "../../dtos/documents/document.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class DocumentsController {
    private documentsService;
    private storageService;
    constructor(documentsService: DocumentsService, storageService: DocumentStorageService);
    findCategories(): Promise<DocumentCategoryDto[]>;
    createCategory(dto: CreateDocumentCategoryDto): Promise<DocumentCategoryDto>;
    findAll(query: PaginationQueryDto, clientId?: string, engagementId?: string, categoryId?: string): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<DocumentListItemDto>>;
    upload(file: Express.Multer.File, clientId: string, engagementId: string | undefined, categoryId: string | undefined, user: JwtPayload): Promise<DocumentListItemDto>;
    findVersions(id: number): Promise<DocumentListItemDto[]>;
    uploadVersion(id: number, file: Express.Multer.File, user: JwtPayload): Promise<DocumentListItemDto>;
    findOne(id: number): Promise<DocumentListItemDto>;
    download(id: number, user: JwtPayload): Promise<StreamableFile>;
    view(id: number, user: JwtPayload): Promise<StreamableFile>;
    getLogs(id: number): Promise<DocumentLogDto[]>;
    remove(id: number, user: JwtPayload): Promise<void>;
}
