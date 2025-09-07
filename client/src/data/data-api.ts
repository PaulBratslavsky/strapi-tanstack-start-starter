import type { TStrapiResponse } from '../types'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiOptions<P = Record<string, unknown>> = {
  method: HTTPMethod
  payload?: P
  timeoutMs?: number
  authToken?: string
}

/**
 * Unified API function with timeout and optional authentication
 *
 * Features:
 * - Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Optional authentication (includes Bearer token when authToken provided)
 * - Timeout protection (8 seconds default)
 * - Consistent error handling and response formatting
 * - Handles DELETE requests without response body parsing
 */

async function apiWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = 8000, // 8 seconds default - good balance between patience and UX
): Promise<Response> {
  // Create controller to manage request cancellation
  const controller = new AbortController()

  // Set up automatic cancellation after timeout period
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal, // Connect the abort signal to fetch
    })
    return response
  } finally {
    // Always clean up the timeout to prevent memory leaks
    // This runs whether the request succeeds, fails, or times out
    clearTimeout(timeout)
  }
}

export async function apiRequest<T = unknown, P = Record<string, unknown>>(
  url: string,
  options: ApiOptions<P>,
): Promise<TStrapiResponse<T>> {
  const { method, payload, timeoutMs = 8000, authToken } = options

  // Set up base headers for JSON communication
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Include Bearer token if provided (public requests when no token, authenticated when token provided)
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  try {
    // Make the actual API request with timeout protection
    const response = await apiWithTimeout(
      url,
      {
        method,
        headers,
        // GET and DELETE requests don't have request bodies
        body:
          method === 'GET' || method === 'DELETE'
            ? undefined
            : JSON.stringify(payload ?? {}),
      },
      timeoutMs,
    )

    // Handle DELETE requests that may not return JSON response body
    if (method === 'DELETE') {
      return response.ok
        ? { data: true as T, success: true, status: response.status }
        : {
            error: {
              status: response.status,
              name: 'Error',
              message: 'Failed to delete resource',
            },
            success: false,
            status: response.status,
          }
    }

    // Parse the JSON response for all other methods
    const data = await response.json()

    // Handle unsuccessful responses (4xx, 5xx status codes)
    if (!response.ok) {
      // Don't log 402 (business logic errors) as errors
      if (response.status !== 402) {
        console.error(`API ${method} error (${response.status}):`, {
          url,
          status: response.status,
          statusText: response.statusText,
          data,
          hasAuthToken: !!authToken,
        })
      }

      // If Strapi returns a structured error, pass it through as-is
      if (data.error) {
        return {
          error: data.error,
          success: false,
          status: response.status,
        }
      }

      // Otherwise create a generic error response
      return {
        error: {
          status: response.status,
          name: data?.error?.name ?? 'Error',
          message:
            data?.error?.message ??
            (response.statusText || 'An error occurred'),
        },
        success: false,
        status: response.status,
      }
    }

    // Success case - extract Strapi data field to avoid double nesting
    // Strapi returns: { data: {...}, meta: {...} }
    // We want to return: { data: {...}, meta: {...}, success: true, status: 200 }
    const responseData = data.data ? data.data : data
    const responseMeta = data.meta ? data.meta : undefined
    return {
      data: responseData as T,
      meta: responseMeta,
      success: true,
      status: response.status,
    }
  } catch (error) {
    // Handle timeout errors specifically (when AbortController cancels the request)
    if ((error as Error).name === 'AbortError') {
      console.error('Request timed out')
      return {
        error: {
          status: 408,
          name: 'TimeoutError',
          message: 'The request timed out. Please try again.',
        },
        success: false,
        status: 408,
      } as TStrapiResponse<T>
    }

    // Handle network errors, JSON parsing errors, and other unexpected issues
    console.error(`Network or unexpected error on ${method} ${url}:`, error)
    return {
      error: {
        status: 500,
        name: 'NetworkError',
        message:
          error instanceof Error ? error.message : 'Something went wrong',
      },
      success: false,
      status: 500,
    } as TStrapiResponse<T>
  }
}

/**
 * Convenience API methods that support both public and authenticated requests
 *
 * Usage examples:
 * // Public request
 * const homePage = await api.get<THomePage>('/api/home-page');
 *
 * // Authenticated request
 * const userProfile = await api.get<TUser>('/api/users/me', { authToken: 'your-token' });
 */
export const api = {
  get: <T>(
    url: string,
    options: { timeoutMs?: number; authToken?: string } = {},
  ) => apiRequest<T>(url, { method: 'GET', ...options }),

  post: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {},
  ) => apiRequest<T, P>(url, { method: 'POST', payload, ...options }),

  put: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {},
  ) => apiRequest<T, P>(url, { method: 'PUT', payload, ...options }),

  patch: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {},
  ) => apiRequest<T, P>(url, { method: 'PATCH', payload, ...options }),

  delete: <T>(
    url: string,
    options: { timeoutMs?: number; authToken?: string } = {},
  ) => apiRequest<T>(url, { method: 'DELETE', ...options }),
}
