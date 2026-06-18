import axios from 'axios'
import type { ApiErrorBody } from '../types/api'

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const apiError = error.response?.data?.error
    if (apiError?.validationErrors?.length) {
      return apiError.validationErrors.join(', ')
    }
    if (apiError?.message) {
      return apiError.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
