export declare class PaginationQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    priority?: string;
    severity?: string;
    isActive?: boolean;
    role?: string;
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
