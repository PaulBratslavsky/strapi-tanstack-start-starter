import { useAppSession } from './session'

/**
 * Get the current user's JWT token from the session
 * Use this in server functions that need authentication
 */
export async function getAuthToken() {
  const session = await useAppSession()
  return session.data.jwt || null
}

/**
 * Get the current user data from the session
 * Use this in server functions that need user information
 */
export async function getCurrentUser() {
  const session = await useAppSession()

  if (!session.data.userId) {
    return null
  }

  return {
    userId: session.data.userId,
    email: session.data.email,
    username: session.data.username,
  }
}

/**
 * Check if user is authenticated
 * Use this in server functions or loaders that require authentication
 */
export async function requireAuth() {
  const session = await useAppSession()

  if (!session.data.userId) {
    throw new Error('Unauthorized - Please login')
  }

  return session.data
}
