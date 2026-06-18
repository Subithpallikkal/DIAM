import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
import { ClientDetailDto, ClientListItemDto, CreateClientDto, UpdateClientDto } from "../../dtos/clients/client.dto";
export declare class ClientsService {
    private prisma;
    private cache;
    constructor(prisma: PrismaService, cache: CacheService);
    create(dto: CreateClientDto, createdByUid: number): Promise<ClientDetailDto>;
    findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<ClientListItemDto>>;
    findOne(id: number): Promise<ClientDetailDto>;
    update(id: number, dto: UpdateClientDto): Promise<ClientDetailDto>;
    deactivate(id: number): Promise<ClientDetailDto>;
    private buildWhere;
    private ensureExists;
    private toListItem;
    private toDetail;
}
