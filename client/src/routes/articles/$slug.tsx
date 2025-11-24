import { createFileRoute, notFound } from '@tanstack/react-router'
import { Article } from '@/components/custom/article'
import { CommentSection } from '@/components/custom/comment-section'
import { strapiApi } from '@/data/server-functions'
import { NotFound } from '@/components/custom/not-found'

export const Route = createFileRoute('/articles/$slug')({
  component: ArticleDetailRoute,
  loader: async ({ params }) => {
    // Validate user with Strapi (uses 2-minute cache)
    const [articleResponse, currentUser] = await Promise.all([
      strapiApi.articles.getArticlesDataBySlug({
        data: params.slug,
      }),
      strapiApi.auth.getAuthServerFunction(),
    ])

    if (!articleResponse.data.length) throw notFound()
    return {
      article: articleResponse.data[0],
      currentUser,
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.article.title },
      { name: 'description', content: loaderData?.article?.description },
    ],
  }),
  notFoundComponent: () => {
    return <NotFound title="Article Not Found" message="Article not found" />
  },
})

function ArticleDetailRoute() {
  const { article, currentUser } = Route.useLoaderData()
  return (
    <>
      <Article {...article} />
      <CommentSection
        articleDocumentId={article.documentId}
        currentUser={currentUser}
      />
    </>
  )
}
