import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateRequiredDocumentDto, RequiredDocumentListItemDto, UpdateRequiredDocumentDto, UpsertRequiredDocumentDto } from "../../dtos/engagements/engagement.dto";
import { EngagementsService } from "./engagements.service";
export declare class RequiredDocumentsService {
    private prisma;
    private engagementsService;
    constructor(prisma: PrismaService, engagementsService: EngagementsService);
    create(engagementId: number, dto: CreateRequiredDocumentDto): Promise<RequiredDocumentListItemDto>;
    upsert(engagementId: number, dto: UpsertRequiredDocumentDto): Promise<RequiredDocumentListItemDto>;
    findAll(engagementId: number): Promise<RequiredDocumentListItemDto[]>;
    update(engagementId: number, docId: number, dto: UpdateRequiredDocumentDto): Promise<RequiredDocumentListItemDto>;
    private toListItem;
}
