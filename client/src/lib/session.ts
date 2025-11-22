import { useSession } from '@tanstack/react-start/server'
import type { TAuthUser } from '@/types'

type SessionData = {
  userId?: number
  email?: string
  username?: string
  jwt?: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'auth-session',
    password: process.env.SESSION_SECRET || 'change-this-to-a-secure-32-char-secret-in-production!',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  })
}

// Cache for validated user data to avoid hitting Strapi on every request
const authCache = new Map<string, { user: TAuthUser; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes - balanced performance and security

/**
 * Get authenticated user by validating the session JWT with Strapi
 *
 * This function:
 * 1. Reads the JWT from the session cookie
 * 2. Validates it with Strapi's /users/me endpoint using SDK
 * 3. Returns user data if valid
 * 4. Clears session if invalid or expired
 * 5. Caches results for 5 minutes to reduce Strapi load
 *
 * @returns Authenticated user or null if not logged in
 */
export async function getAuth(): Promise<TAuthUser | null> {
  const session = await useAppSession()
  const jwt = session.data.jwt

  // No JWT in session = not logged in
  if (!jwt) return null

  // Check cache first
  const cached = authCache.get(jwt)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user
  }

  // Validate with Strapi using SDK
  try {
    const { getUserMe } = await import('@/data/strapi-sdk')
    const user = await getUserMe(jwt)

    // Success: cache and return user
    authCache.set(jwt, { user, timestamp: Date.now() })

    // Update session with latest user data
    await session.update({
      ...session.data,
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    return user

  } catch (error) {
    // Invalid token or network error
    console.error('Auth validation error:', error)

    // If we have cached data, return it during network issues
    if (cached) {
      return cached.user
    }

    // Invalid token: clear session and cache
    authCache.delete(jwt)
    await session.clear()
    return null
  }
}

/**
 * Clear authentication session and cache
 */
export async function clearAuth(): Promise<void> {
  const session = await useAppSession()
  const jwt = session.data.jwt

  if (jwt) {
    authCache.delete(jwt)
  }

  await session.clear()
}
