import { createFileRoute } from '@tanstack/react-router'
import { strapiApi } from '../data/server-functions'
import { BlockRenderer } from '@/components/blocks/block-renderer'

export const Route = createFileRoute('/$slug')({
  loader: async ({ params }) => {
    const pageData = await strapiApi.page.getPageData({ data: params.slug })
    return { blocks: pageData.data.blocks }
  },
  component: App,
})

function App() {
  const { blocks } = Route.useLoaderData()
  return <BlockRenderer blocks={blocks} />
}
