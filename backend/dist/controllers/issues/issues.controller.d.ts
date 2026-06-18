import { IssuesService } from "../../services/issues/issues.service";
import { AssignIssueDto, CreateFindingDto, CreateIssueDto, FindingDto, IssueDetailDto, IssueListItemDto, UpdateIssueDto } from "../../dtos/issues/issue.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class IssuesController {
    private issuesService;
    constructor(issuesService: IssuesService);
    findAll(query: PaginationQueryDto, engagementId?: string, status?: string): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<IssueListItemDto>>;
    findOne(id: number): Promise<IssueDetailDto>;
    create(engagementId: number, dto: CreateIssueDto, user: JwtPayload): Promise<IssueListItemDto>;
    update(id: number, dto: UpdateIssueDto, user: JwtPayload): Promise<IssueDetailDto>;
    assign(id: number, dto: AssignIssueDto, user: JwtPayload): Promise<IssueDetailDto>;
    addFinding(id: number, dto: CreateFindingDto, user: JwtPayload): Promise<FindingDto>;
    remove(id: number): Promise<void>;
}
