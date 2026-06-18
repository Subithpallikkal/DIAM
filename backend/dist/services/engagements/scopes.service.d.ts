import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateScopeDto, ScopeListItemDto } from "../../dtos/engagements/engagement.dto";
import { EngagementsService } from "./engagements.service";
export declare class ScopesService {
    private prisma;
    private engagementsService;
    constructor(prisma: PrismaService, engagementsService: EngagementsService);
    create(engagementId: number, dto: CreateScopeDto): Promise<ScopeListItemDto>;
    findAll(engagementId: number): Promise<ScopeListItemDto[]>;
    remove(engagementId: number, scopeId: number): Promise<void>;
    private toListItem;
}
