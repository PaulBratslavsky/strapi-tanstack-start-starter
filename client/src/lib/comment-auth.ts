/**
 * Client-side comment auth utilities
 *
 * NOTE: These are for UI purposes only (showing/hiding buttons).
 * Actual permission enforcement is handled by Strapi API middlewares:
 * - create: api::comment.set-user (auto-assigns authenticated user)
 * - update/delete: global::is-owner (verifies ownership)
 */

export interface CurrentUser {
  userId: number
  email?: string
  username?: string
}

/**
 * Check if current user owns a comment (for UI purposes - showing edit/delete buttons)
 * Backend middleware enforces actual permissions
 */
export function isCommentOwner(commentUserId?: string, currentUserId?: number): boolean {
  if (!commentUserId || !currentUserId) return false
  return commentUserId === String(currentUserId)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(currentUser?: CurrentUser | null): boolean {
  return !!currentUser?.userId
}

/**
 * Handle authentication errors gracefully
 */
export function handleAuthError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      return 'Please sign in to perform this action'
    }
    if (error.message.includes('Forbidden') || error.message.includes('403')) {
      return 'You do not have permission to perform this action'
    }
    return error.message
  }
  return 'An authentication error occurred'
}
