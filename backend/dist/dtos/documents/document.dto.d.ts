export declare class CreateDocumentCategoryDto {
    name: string;
    description?: string;
}
export declare class DocumentCategoryDto {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
}
export declare class DocumentListItemDto {
    id: number;
    clientId: number;
    clientName: string;
    engagementId: number | null;
    engagementTitle: string | null;
    categoryId: number | null;
    categoryName: string | null;
    originalName: string;
    mimeType: string;
    fileSize: number;
    uploadedByName: string;
    version: number;
    parentDocumentId: number | null;
    rootDocumentId: number;
    versionCount: number;
    createdAt: Date;
}
export declare class DocumentLogDto {
    id: number;
    action: string;
    performedByName: string;
    details: string | null;
    createdAt: Date;
}
