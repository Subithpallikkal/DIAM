import { RequiredDocumentsService } from "../../services/engagements/required-documents.service";
import { CreateRequiredDocumentDto, RequiredDocumentListItemDto, UpdateRequiredDocumentDto } from "../../dtos/engagements/engagement.dto";
export declare class RequiredDocumentsController {
    private requiredDocumentsService;
    constructor(requiredDocumentsService: RequiredDocumentsService);
    create(engagementId: number, dto: CreateRequiredDocumentDto): Promise<RequiredDocumentListItemDto>;
    findAll(engagementId: number): Promise<RequiredDocumentListItemDto[]>;
    update(engagementId: number, docId: number, dto: UpdateRequiredDocumentDto): Promise<RequiredDocumentListItemDto>;
}
