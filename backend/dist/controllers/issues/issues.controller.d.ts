import { IssuesService } from "../../services/issues/issues.service";
import { AssignIssueDto, AssignIssueClientDto, CreateFindingDto, FindingDto, IssueDetailDto, IssueListItemDto, UpsertIssueDto } from "../../dtos/issues/issue.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class IssuesController {
    private issuesService;
    constructor(issuesService: IssuesService);
    findAll(query: PaginationQueryDto, engagementId?: string, status?: string): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<IssueListItemDto>>;
    findOne(id: number): Promise<IssueDetailDto>;
    upsert(engagementId: number, dto: UpsertIssueDto, user: JwtPayload): Promise<IssueListItemDto | IssueDetailDto>;
    assign(id: number, dto: AssignIssueDto, user: JwtPayload): Promise<IssueDetailDto>;
    assignClient(id: number, dto: AssignIssueClientDto): Promise<IssueDetailDto>;
    addFinding(id: number, dto: CreateFindingDto, user: JwtPayload): Promise<FindingDto>;
    remove(id: number): Promise<void>;
}
