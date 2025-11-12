import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArticleDetail } from '@/components/custom/article-detail'
import { CommentSection } from '@/components/custom/comment-section'
import { strapiApi } from '@/data/server-functions'
import { NotFound } from '@/components/custom/not-found'

export const Route = createFileRoute('/articles/$slug')({
  component: ArticleDetailRoute,
  loader: async ({ params }) => {
    const [articleResponse, currentUser] = await Promise.all([
      strapiApi.articles.getArticlesDataBySlug({
        data: params.slug,
      }),
      strapiApi.auth.getCurrentUserServerFunction(),
    ])

    if (!articleResponse.data.length) throw notFound()
    return {
      article: articleResponse.data[0],
      currentUser,
    }
  },
  notFoundComponent: () => {
    return <NotFound title="Article Not Found" message="Article not found" />
  },
})

function ArticleDetailRoute() {
  const { article, currentUser } = Route.useLoaderData()
  return (
    <>
      <ArticleDetail {...article} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CommentSection
            articleDocumentId={article.documentId}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  )
}
