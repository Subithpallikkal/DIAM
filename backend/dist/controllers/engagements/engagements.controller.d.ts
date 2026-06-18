import { EngagementsService } from "../../services/engagements/engagements.service";
import { CreateEngagementDto, EngagementDetailDto, EngagementListItemDto, UpdateEngagementDto } from "../../dtos/engagements/engagement.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class EngagementsController {
    private engagementsService;
    constructor(engagementsService: EngagementsService);
    create(dto: CreateEngagementDto, user: JwtPayload): Promise<EngagementDetailDto>;
    findAll(query: PaginationQueryDto): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<EngagementListItemDto>>;
    findOne(id: number): Promise<EngagementDetailDto>;
    update(id: number, dto: UpdateEngagementDto): Promise<EngagementDetailDto>;
    remove(id: number): Promise<void>;
}
