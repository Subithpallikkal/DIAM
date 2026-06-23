import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { CreateEngagementDto, EngagementDetailDto, EngagementListItemDto, UpdateEngagementDto, UpsertEngagementDto } from "../../dtos/engagements/engagement.dto";
export declare class EngagementsService {
    private prisma;
    private cache;
    private static readonly LIST_CACHE_TTL_MS;
    private static readonly DETAIL_CACHE_TTL_MS;
    constructor(prisma: PrismaService, cache: CacheService);
    create(dto: CreateEngagementDto, createdByUid: number): Promise<EngagementDetailDto>;
    upsert(dto: UpsertEngagementDto, createdByUid: number): Promise<EngagementDetailDto>;
    findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<EngagementListItemDto>>;
    findOne(id: number): Promise<EngagementDetailDto>;
    update(id: number, dto: UpdateEngagementDto): Promise<EngagementDetailDto>;
    remove(id: number): Promise<void>;
    private buildListCacheKey;
    private buildWhere;
    private buildOrderBy;
    ensureExists(id: number): Promise<void>;
    private ensureClientExists;
    private toListItem;
    private toDetail;
}
