import { EngagementsService } from "../../services/engagements/engagements.service";
import { EngagementDetailDto, EngagementListItemDto, UpsertEngagementDto } from "../../dtos/engagements/engagement.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class EngagementsController {
    private engagementsService;
    constructor(engagementsService: EngagementsService);
    upsert(dto: UpsertEngagementDto, user: JwtPayload): Promise<EngagementDetailDto>;
    findAll(query: PaginationQueryDto): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<EngagementListItemDto>>;
    findOne(id: number): Promise<EngagementDetailDto>;
    remove(id: number): Promise<void>;
}
