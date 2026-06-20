import { PrismaService } from "../../common/prisma/prisma.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { AssignIssueDto, CreateFindingDto, CreateIssueDto, FindingDto, IssueDetailDto, IssueListItemDto, UpdateIssueDto, UpsertIssueDto } from "../../dtos/issues/issue.dto";
export declare class IssuesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationQueryDto, filters?: {
        engagementId?: number;
        status?: string;
    }): Promise<PaginatedResponseDto<IssueListItemDto>>;
    private buildOrderBy;
    findOne(id: number): Promise<IssueDetailDto>;
    create(engagementId: number, dto: CreateIssueDto, createdByUid: number): Promise<IssueListItemDto>;
    upsert(engagementId: number, dto: UpsertIssueDto, changedByUid: number): Promise<IssueDetailDto | IssueListItemDto>;
    update(id: number, dto: UpdateIssueDto, changedByUid: number): Promise<IssueDetailDto>;
    assign(issueId: number, dto: AssignIssueDto, assignedByUid: number): Promise<IssueDetailDto>;
    addFinding(issueId: number, dto: CreateFindingDto, createdByUid: number): Promise<FindingDto>;
    remove(id: number): Promise<void>;
    ensureExists(id: number): Promise<void>;
    private ensureBelongsToEngagement;
    private ensureEngagementExists;
    private ensureUserExists;
    private toListItem;
    private toDetail;
}
