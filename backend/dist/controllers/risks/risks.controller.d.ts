import { RisksService } from "../../services/risks/risks.service";
import { AssignChecklistDto, ChecklistItemDto, RiskListItemDto, UpsertChecklistItemDto, UpsertRiskDto } from "../../dtos/risks/risk.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class RisksController {
    private risksService;
    constructor(risksService: RisksService);
    findAll(query: PaginationQueryDto, engagementId?: string): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<RiskListItemDto>>;
    findOne(id: number): Promise<RiskListItemDto>;
    upsert(engagementId: number, dto: UpsertRiskDto, user: JwtPayload): Promise<RiskListItemDto>;
    remove(id: number): Promise<void>;
    findChecklists(id: number): Promise<ChecklistItemDto[]>;
    upsertChecklist(id: number, dto: UpsertChecklistItemDto): Promise<ChecklistItemDto>;
    assignChecklist(id: number, checklistId: number, dto: AssignChecklistDto, user: JwtPayload): Promise<ChecklistItemDto>;
}
