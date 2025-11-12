import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import globalCss from '../global.css?url'
import customCss from '../custom.css?url'

import { TopNavigation } from '../components/custom/top-navigation'
import { strapiApi } from '../data/server-functions'
import { NotFound } from '../components/custom/not-found'
import { ThemeProvider } from '@/components/custom/theme-provider'

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
    const currentUser = await strapiApi.auth.getCurrentUserServerFunction()
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
        rel: 'stylesheet',
        href: customCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  const { header, currentUser } = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TopNavigation header={header} currentUser={currentUser} />
            <main>{children}</main>
            <TanstackDevtools
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
