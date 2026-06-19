import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { AssignIssueDto, CreateFindingDto, CreateIssueDto, FindingDto, IssueDetailDto, IssueListItemDto, UpdateIssueDto } from "../../dtos/issues/issue.dto";
export declare class IssuesService {
    private prisma;
    private cache;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(query: PaginationQueryDto, filters?: {
        engagementId?: number;
        status?: string;
    }): Promise<PaginatedResponseDto<IssueListItemDto>>;
    private buildOrderBy;
    findOne(id: number): Promise<IssueDetailDto>;
    create(engagementId: number, dto: CreateIssueDto, createdByUid: number): Promise<IssueListItemDto>;
    update(id: number, dto: UpdateIssueDto, changedByUid: number): Promise<IssueDetailDto>;
    assign(issueId: number, dto: AssignIssueDto, assignedByUid: number): Promise<IssueDetailDto>;
    addFinding(issueId: number, dto: CreateFindingDto, createdByUid: number): Promise<FindingDto>;
    remove(id: number): Promise<void>;
    ensureExists(id: number): Promise<void>;
    private ensureEngagementExists;
    private ensureUserExists;
    private toListItem;
    private toDetail;
}
