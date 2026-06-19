import { PaginationQueryDto, PaginatedResponseDto } from "../../dtos/common/pagination.dto";

export function resolvePagination(query: PaginationQueryDto) {
  const page = query.page ?? 1;
  const limit = Math.min(query.limit ?? 20, 100);
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function resolveSortDirection(query: PaginationQueryDto): "asc" | "desc" {
  return query.sortOrder === "asc" ? "asc" : "desc";
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponseDto<T> {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: total > 0 ? Math.ceil(total / limit) : 1,
    },
  };
}
