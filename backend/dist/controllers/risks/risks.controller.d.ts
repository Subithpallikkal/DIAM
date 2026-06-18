import { RisksService } from "../../services/risks/risks.service";
import { AssignChecklistDto, ChecklistItemDto, CreateChecklistItemDto, CreateRiskDto, RiskListItemDto, UpdateChecklistItemDto, UpdateRiskDto } from "../../dtos/risks/risk.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class RisksController {
    private risksService;
    constructor(risksService: RisksService);
    findAll(query: PaginationQueryDto, engagementId?: string): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<RiskListItemDto>>;
    findOne(id: number): Promise<RiskListItemDto>;
    create(engagementId: number, dto: CreateRiskDto, user: JwtPayload): Promise<RiskListItemDto>;
    update(id: number, dto: UpdateRiskDto): Promise<RiskListItemDto>;
    remove(id: number): Promise<void>;
    findChecklists(id: number): Promise<ChecklistItemDto[]>;
    addChecklist(id: number, dto: CreateChecklistItemDto): Promise<ChecklistItemDto>;
    updateChecklist(id: number, checklistId: number, dto: UpdateChecklistItemDto): Promise<ChecklistItemDto>;
    assignChecklist(id: number, checklistId: number, dto: AssignChecklistDto, user: JwtPayload): Promise<ChecklistItemDto>;
}
