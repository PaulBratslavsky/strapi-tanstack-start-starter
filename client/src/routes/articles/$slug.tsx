import { createFileRoute, notFound } from '@tanstack/react-router'
import { strapiApi } from '@/data/server-functions'
import { ArticleDetail } from '../../components/custom/article-detail'
import { NotFound } from '@/components/custom/not-found'

export const Route = createFileRoute('/articles/$slug')({
  component: ArticleDetailRoute,
  loader: async ({ params }) => {
    const response = await strapiApi.articles.getArticlesDataBySlug({
      data: params.slug,
    })
    const data = response.data?.[0]
    if (!data) throw notFound()

    return response.data?.[0]
  },
  notFoundComponent: () => {
    return <NotFound title="Article Not Found" message="Article not found" />
  },
})

function ArticleDetailRoute() {
  const articleData = Route.useLoaderData()
  if (!articleData) return null
  return <ArticleDetail {...articleData} />
}
