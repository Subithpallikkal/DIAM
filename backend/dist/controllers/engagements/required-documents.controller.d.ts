import { RequiredDocumentsService } from "../../services/engagements/required-documents.service";
import { RequiredDocumentListItemDto, UpsertRequiredDocumentDto } from "../../dtos/engagements/engagement.dto";
export declare class RequiredDocumentsController {
    private requiredDocumentsService;
    constructor(requiredDocumentsService: RequiredDocumentsService);
    upsert(engagementId: number, dto: UpsertRequiredDocumentDto): Promise<RequiredDocumentListItemDto>;
    findAll(engagementId: number): Promise<RequiredDocumentListItemDto[]>;
}
