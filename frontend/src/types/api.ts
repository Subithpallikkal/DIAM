export interface ApiErrorBody {
  success: false
  error: {
    statusCode: number
    message: string
    errorCode: string
    validationErrors?: string[]
    timestamp: string
    path: string
  }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ListQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  status?: string
  priority?: string
  severity?: string
  isActive?: boolean
  role?: string
  engagementId?: number
  clientId?: number
  categoryId?: number
}

/** Backend `PaginationQueryDto` caps `limit` at 100. */
export const API_MAX_PAGE_SIZE = 100
