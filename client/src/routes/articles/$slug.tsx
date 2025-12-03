import { Suspense, lazy } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Article } from '@/components/custom/article'
import { strapiApi } from '@/data/server-functions'
import { NotFound } from '@/components/custom/not-found'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load heavy components that aren't needed immediately
const CommentSection = lazy(() =>
  import('@/components/custom/comment-section').then((mod) => ({
    default: mod.CommentSection,
  }))
)

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
      { name: 'description', content: loaderData?.article.description },
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
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="border-4 border-black bg-white p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <CommentSection
          articleDocumentId={article.documentId}
          currentUser={currentUser}
        />
      </Suspense>
    </>
  )
}
