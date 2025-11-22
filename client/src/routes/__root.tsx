import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import globalCss from '../global.css?url'

import { TopNavigation } from '../components/custom/top-navigation'
import { strapiApi } from '../data/server-functions'
import { NotFound } from '../components/custom/not-found'
import type { THeader } from '@/types'
import { ThemeProvider } from '@/components/custom/theme-provider'
import { ScrollToTop } from '@/components/custom/scroll-to-top'

// Session user data returned from auth server function
interface SessionUser {
  userId: number
  email: string
  username: string
}

interface RootLoaderData {
  header: THeader
  currentUser: SessionUser | null
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
})

export const Route = createRootRouteWithContext<{
  strapiApi: typeof strapiApi
}>()({
  loader: async () => {
    const globalData = await strapiApi.global.getGlobalData()

    // Validate user with Strapi (uses 2-minute cache)
    const currentUser = await strapiApi.auth.getAuthServerFunction()

    return {
      header: globalData.data.header,
      currentUser,
    }
  },
  notFoundComponent: () => {
    return <NotFound title="Page Not Found" message="Global not found." />
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: globalCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  // shellComponent renders before loader completes during SSR, so data may be undefined
  // We need to handle the case where loaderData is not yet available
  let loaderData: RootLoaderData | undefined
  try {
    loaderData = Route.useLoaderData()
  } catch {
    // During initial SSR, loader data might not be available yet
    loaderData = undefined
  }

  // Provide safe defaults during SSR when loader hasn't completed yet
  const header = loaderData?.header
  const currentUser = loaderData?.currentUser

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="h-screen flex flex-col overflow-hidden">
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TopNavigation header={header} currentUser={currentUser} />
            <main id="main-content" className="flex-1 overflow-y-auto">{children}</main>
            <ScrollToTop />
            <TanStackDevtools
              config={{
                position: 'bottom-left',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
            <Scripts />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
