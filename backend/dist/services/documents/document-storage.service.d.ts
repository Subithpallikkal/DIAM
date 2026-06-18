import { StreamableFile } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
export declare class DocumentStorageService {
    private documentsService;
    private readonly uploadDir;
    constructor(documentsService: DocumentsService);
    upload(file: Express.Multer.File, data: {
        clientId: number;
        engagementId?: number;
        categoryId?: number;
        uploadedByUid: number;
    }): Promise<import("../../dtos/documents/document.dto").DocumentListItemDto>;
    download(documentId: number, performedByUid: number): Promise<StreamableFile>;
    view(documentId: number, performedByUid: number): Promise<StreamableFile>;
    deleteFile(documentId: number, performedByUid: number): Promise<void>;
}
