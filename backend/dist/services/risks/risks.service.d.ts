import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { AssignChecklistDto, ChecklistItemDto, CreateChecklistItemDto, CreateRiskDto, RiskListItemDto, UpdateChecklistItemDto, UpdateRiskDto } from "../../dtos/risks/risk.dto";
export declare class RisksService {
    private prisma;
    private cache;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(query: PaginationQueryDto, engagementId?: number): Promise<PaginatedResponseDto<RiskListItemDto>>;
    findOne(id: number): Promise<RiskListItemDto>;
    create(engagementId: number, dto: CreateRiskDto, createdByUid: number): Promise<RiskListItemDto>;
    update(id: number, dto: UpdateRiskDto): Promise<RiskListItemDto>;
    remove(id: number): Promise<void>;
    findChecklists(riskId: number): Promise<ChecklistItemDto[]>;
    addChecklistItem(riskId: number, dto: CreateChecklistItemDto): Promise<ChecklistItemDto>;
    updateChecklistItem(riskId: number, checklistId: number, dto: UpdateChecklistItemDto): Promise<ChecklistItemDto>;
    assignChecklistItem(riskId: number, checklistId: number, dto: AssignChecklistDto, assignedByUid: number): Promise<ChecklistItemDto>;
    ensureExists(id: number): Promise<void>;
    private ensureEngagementExists;
    private ensureChecklistBelongsToRisk;
    private ensureUserExists;
    private toListItem;
}
