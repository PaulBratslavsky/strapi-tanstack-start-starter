import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { strapiApi } from './data/server-functions'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export function getRouter() {
  return createTanstackRouter({
    routeTree,
    context: {
      strapiApi,
    },
    scrollRestoration: true,
    scrollToTopSelectors: ['#main-content'],
    defaultPreloadStaleTime: 0,
  })
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
