import { createFileRoute } from '@tanstack/react-router'
import { getStrapiURL } from '@/lib/utils'

export const Route = createFileRoute('/api/connect/$provider')({
  server: {
    handlers: {
      GET: ({ params }) => {
        const { provider } = params
        const strapiUrl = getStrapiURL()

        // Redirect to Strapi's OAuth connect endpoint
        const connectUrl = `${strapiUrl}/api/connect/${provider}`

        console.log('Redirecting to OAuth provider', {
          provider,
          connectUrl,
        })

        return new Response(null, {
          status: 302,
          headers: { Location: connectUrl },
        })
      },
    },
  },
})
