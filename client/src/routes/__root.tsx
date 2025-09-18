import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import globalCss from '../global.css?url'
import customCss from '../custom.css?url'

import { TopNavigation } from '../components/custom/top-navigation'
import { strapiApi } from '../data/server-functions'
import { NotFound } from '../components/custom/not-found'
import { ThemeProvider } from '@/components/custom/theme-provider'

export const Route = createRootRouteWithContext<{
  strapiApi: typeof strapiApi
}>()({
  loader: async () => {
    const globalData = await strapiApi.global.getGlobalData()
    return {
      header: globalData.data.header,
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
  const { header } = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TopNavigation header={header} />
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
      </body>
    </html>
  )
}
