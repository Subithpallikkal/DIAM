import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";
export declare function resolvePagination(query: PaginationQueryDto): {
    page: number;
    limit: number;
    skip: number;
    take: number;
};
export declare function resolveSortDirection(query: PaginationQueryDto): "asc" | "desc";
export declare function buildPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponseDto<T>;
