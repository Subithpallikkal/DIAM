import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateRequiredDocumentDto, RequiredDocumentListItemDto, UpdateRequiredDocumentDto } from "../../dtos/engagements/engagement.dto";
import { EngagementsService } from "./engagements.service";
export declare class RequiredDocumentsService {
    private prisma;
    private engagementsService;
    constructor(prisma: PrismaService, engagementsService: EngagementsService);
    create(engagementId: number, dto: CreateRequiredDocumentDto): Promise<RequiredDocumentListItemDto>;
    findAll(engagementId: number): Promise<RequiredDocumentListItemDto[]>;
    update(engagementId: number, docId: number, dto: UpdateRequiredDocumentDto): Promise<RequiredDocumentListItemDto>;
    private toListItem;
}
