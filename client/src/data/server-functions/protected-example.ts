import { createServerFn } from '@tanstack/react-start'
import { getAuthToken, getCurrentUser, requireAuth } from '@/lib/auth-helpers'
import { getStrapiURL } from '@/lib/utils'

// Example 1: Using getAuthToken to make authenticated API calls
export const getUserProfile = createServerFn({
  method: 'GET',
}).handler(async () => {
  const token = await getAuthToken()

  if (!token) {
    return { error: 'Not authenticated' }
  }

  // Use the token to make authenticated requests to your API
  const baseUrl = getStrapiURL()
  const url = new URL('/api/users/me', baseUrl)

  const response = await fetch(url.href, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  return data
})

// Example 2: Using getCurrentUser to get session data
export const getUserDashboard = createServerFn({
  method: 'GET',
}).handler(async () => {
  const user = await getCurrentUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  return {
    message: `Welcome ${user.username}!`,
    userId: user.userId,
    email: user.email,
  }
})

// Example 3: Using requireAuth to enforce authentication
export const deleteUserAccount = createServerFn({
  method: 'POST',
}).handler(async () => {
  // This will throw an error if user is not authenticated
  const session = await requireAuth()

  // Proceed with deletion using the authenticated user's token
  const baseUrl = getStrapiURL()
  const url = new URL(`/api/users/${session.userId}`, baseUrl)

  const response = await fetch(url.href, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session.jwt}`,
    },
  })

  return { success: true, message: 'Account deleted' }
})
