import { createFileRoute } from '@tanstack/react-router'
import { strapiApi } from '../data/server-functions'
import { BlockRenderer } from '@/components/blocks/block-renderer'

export const Route = createFileRoute('/$slug')({
  loader: async ({ params }) => {
    const pageData = await strapiApi.page.getPageData({ data: params.slug })
    return {
      blocks: pageData.data.blocks,
      title: pageData.data.title,
      description: pageData.data.description,
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      { name: 'description', content: loaderData?.description },
    ],
  }),
  component: App,
})

function App() {
  const { blocks } = Route.useLoaderData()
  return <BlockRenderer blocks={blocks} />
}
