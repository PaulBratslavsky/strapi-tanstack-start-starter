import { createFileRoute, notFound } from '@tanstack/react-router'
import { strapiApi } from '../data/server-functions'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { NotFound } from '@/components/custom/not-found'

export const Route = createFileRoute('/$slug')({
  loader: async ({ params }) => {
    const pageData = await strapiApi.page.getPageData({ data: params.slug })
    const page = pageData.data

     
    if (!page) {
      throw notFound()
    }

    return {
      blocks: page.blocks,
      title: page.title,
      description: page.description,
    }
  },
  notFoundComponent: () => (
    <NotFound
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
    />
  ),
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
