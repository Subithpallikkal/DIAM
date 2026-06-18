import { ScopesService } from "../../services/engagements/scopes.service";
import { CreateScopeDto, ScopeListItemDto } from "../../dtos/engagements/engagement.dto";
export declare class ScopesController {
    private scopesService;
    constructor(scopesService: ScopesService);
    create(engagementId: number, dto: CreateScopeDto): Promise<ScopeListItemDto>;
    findAll(engagementId: number): Promise<ScopeListItemDto[]>;
    remove(engagementId: number, scopeId: number): Promise<void>;
}
