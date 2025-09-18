import { createFileRoute } from '@tanstack/react-router'
import { strapiApi } from '../data/server-functions'
import { BlockRenderer } from '@/components/blocks/block-renderer'

export const Route = createFileRoute('/')({
  loader: async () => {
    const landingPageData = await strapiApi.landingPage.getLandingPageData()
    return { blocks: landingPageData.data.blocks }
  },
  component: App,
})

function App() {
  const { blocks } = Route.useLoaderData()
  return <BlockRenderer blocks={blocks} />
}
