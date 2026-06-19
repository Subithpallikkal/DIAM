"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePagination = resolvePagination;
exports.resolveSortDirection = resolveSortDirection;
exports.buildPaginatedResponse = buildPaginatedResponse;
function resolvePagination(query) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    return {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit,
    };
}
function resolveSortDirection(query) {
    return query.sortOrder === "asc" ? "asc" : "desc";
}
function buildPaginatedResponse(data, total, page, limit) {
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
//# sourceMappingURL=pagination.util.js.map