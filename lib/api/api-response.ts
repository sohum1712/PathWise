export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    path?: string
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: ApiResponse<T>['meta'] & {
    total: number
    page: number
    limit: number
    pages: number
  }
}

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Create an error response
 */
export function errorResponse(
  code: string,
  message: string,
  details?: any
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const pages = Math.ceil(total / limit)
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      total,
      page,
      limit,
      pages,
    },
  }
}

/**
 * Parse pagination params
 */
export function parsePaginationParams(
  searchParams: Record<string, string | string[] | undefined>
) {
  const page = Math.max(1, parseInt((searchParams.page as string) || '1', 10))
  const limit = Math.max(1, Math.min(100, parseInt((searchParams.limit as string) || '10', 10)))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Validation error helper
 */
export class ValidationError extends ApiError {
  constructor(message: string, public validationErrors?: Record<string, string[]>) {
    super('VALIDATION_ERROR', 400, message, validationErrors)
    this.name = 'ValidationError'
  }
}

/**
 * Not found error helper
 */
export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super('NOT_FOUND', 404, `${resource} not found`)
    this.name = 'NotFoundError'
  }
}

/**
 * Unauthorized error helper
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', 401, message)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Forbidden error helper
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', 403, message)
    this.name = 'ForbiddenError'
  }
}

/**
 * Server error helper
 */
export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error', details?: any) {
    super('SERVER_ERROR', 500, message, details)
    this.name = 'ServerError'
  }
}
