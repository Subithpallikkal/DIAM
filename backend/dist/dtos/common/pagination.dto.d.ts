export declare class PaginationQueryDto {
    page?: number;
    limit?: number;
    search?: string;
}
export declare class PaginatedMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    meta: PaginatedMetaDto;
}
