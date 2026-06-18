import { ClientsService } from "../../services/clients/clients.service";
import { ClientDetailDto, ClientListItemDto, CreateClientDto, UpdateClientDto } from "../../dtos/clients/client.dto";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
export declare class ClientsController {
    private clientsService;
    constructor(clientsService: ClientsService);
    create(dto: CreateClientDto, user: JwtPayload): Promise<ClientDetailDto>;
    findAll(query: PaginationQueryDto): Promise<import("../../dtos/common/pagination.dto").PaginatedResponseDto<ClientListItemDto>>;
    findOne(id: number): Promise<ClientDetailDto>;
    update(id: number, dto: UpdateClientDto): Promise<ClientDetailDto>;
    deactivate(id: number): Promise<ClientDetailDto>;
}
