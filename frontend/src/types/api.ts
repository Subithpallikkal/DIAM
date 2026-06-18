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
}
