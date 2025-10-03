import { createServerFileRoute } from '@tanstack/react-start/server'
import { getStrapiURL } from '@/lib/utils'
import { useAppSession } from '@/lib/session'

export const ServerRoute = createServerFileRoute('/api/connect/$provider/redirect').methods({
  GET: async ({ request, params }) => {
    const { provider } = params
    const url = new URL(request.url)
    const token = url.searchParams.get('access_token')

    console.log('User attempting to sign in', {
      provider,
      hasToken: !!token,
    })

    if (!token) {
      console.warn('Sign in failed - no access token provided', { provider })
      return new Response(null, {
        status: 302,
        headers: { Location: '/' },
      })
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
        return new Response(null, {
          status: 302,
          headers: { Location: '/' },
        })
      }

      if (!data.jwt) {
        console.error('Authentication failed - no JWT returned', {
          provider,
          response: data,
        })
        return new Response(null, {
          status: 302,
          headers: { Location: '/' },
        })
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
      return new Response(null, {
        status: 302,
        headers: { Location: '/' },
      })
    } catch (error) {
      console.error('Sign in process failed with exception', {
        provider,
        error: error instanceof Error ? error.message : String(error),
      })
      return new Response(null, {
        status: 302,
        headers: { Location: '/' },
      })
    }
  },
})
