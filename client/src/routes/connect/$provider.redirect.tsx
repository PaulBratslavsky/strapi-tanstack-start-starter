import { createFileRoute, redirect } from '@tanstack/react-router'
import { getStrapiURL } from '@/lib/utils'
import { useAppSession } from '@/lib/session'

export const Route = createFileRoute('/connect/$provider/redirect')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      access_token: (search.access_token as string) || '',
    }
  },
  loaderDeps: ({ search }) => ({ access_token: search.access_token }),
  loader: async ({ params, deps }) => {
    const { provider } = params
    const token = deps.access_token

    console.log('User attempting to sign in', {
      provider,
      hasToken: !!token,
    })

    if (!token) {
      console.warn('Sign in failed - no access token provided', { provider })
      throw redirect({ to: '/' })
    }

    const backendUrl = getStrapiURL()
    const path = `/api/auth/${provider}/callback`
    const callbackUrl = new URL(backendUrl + path)
    callbackUrl.searchParams.append('access_token', token)

    try {
      console.log('Calling authentication provider', {
        provider,
        callbackUrl: callbackUrl.href,
      })

      const res = await fetch(callbackUrl.href)
      const data = await res.json()

      if (!res.ok) {
        console.error('Authentication provider returned error', {
          provider,
          status: res.status,
          statusText: res.statusText,
          error: data,
        })
        throw redirect({ to: '/' })
      }

      if (!data.jwt) {
        console.error('Authentication failed - no JWT returned', {
          provider,
          response: data,
        })
        throw redirect({ to: '/' })
      }

      // Set HTTP-only cookie session
      const session = await useAppSession()
      await session.update({
        userId: data.user.id,
        email: data.user.email,
        username: data.user.username,
        jwt: data.jwt,
      })

      console.log('User successfully signed in', {
        provider,
        userId: data.user.id,
      })

      // Redirect to home or saved redirect URL
      throw redirect({ to: '/' })
    } catch (error) {
      if (error instanceof Error && 'href' in error) {
        // This is a redirect, let it through
        throw error
      }

      console.error('Sign in process failed with exception', {
        provider,
        error: error instanceof Error ? error.message : String(error),
      })
      throw redirect({ to: '/' })
    }
  },
  component: () => null,
})
