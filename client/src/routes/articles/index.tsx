import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { strapiApi } from '@/data/server-functions'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { StrapiImage } from '@/components/custom/strapi-image'
import { Search } from '@/components/custom/search'
import { PaginationComponent } from '@/components/custom/pagination-component'

const articlesSearchSchema = z.object({
  query: z.string().optional(),
  page: z.number().catch(1),
})

export const Route = createFileRoute('/articles/')({
  validateSearch: articlesSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    const { query, page } = deps.search
    const articlesData = await strapiApi.articles.getArticlesData({
      data: {
        query,
        page,
      },
    })
    return { articlesData }
  },
  component: Articles,
})

const styles = {
  root: 'min-h-screen bg-background',
  container: 'container mx-auto px-4 py-16',
  header: 'text-center mb-12',
  title: 'text-4xl font-bold text-foreground mb-4',
  subtitle: 'text-xl text-muted-foreground max-w-2xl mx-auto',
  search: 'container mx-auto py-4',

  emptyWrap: 'text-center py-12',
  emptyText: 'text-muted-foreground text-lg',

  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',

  card: 'pt-0 pb-8 group hover:shadow-lg transition-shadow overflow-hidden cursor-pointer bg-card border border-border',
  imageWrapper: 'overflow-hidden',
  image: 'group-hover:scale-105 transition-transform duration-300',

  cardHeader: 'pb-3',
  metaRow: 'flex items-center gap-2 text-sm text-muted-foreground mb-2',
  badge: 'text-xs',
  cardTitle:
    'text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2 text-card-foreground',

  cardContent: 'pt-0',
  description: 'text-muted-foreground line-clamp-3 leading-relaxed',
}

function Articles() {
  const { articlesData } = Route.useLoaderData()
  const articles = articlesData.data
  const totalPages = articlesData.meta?.pagination?.pageCount || 1

  console.dir(totalPages)

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Articles</h1>
          <p className={styles.subtitle}>
            Discover insights, tutorials, and stories from our team
          </p>
          <div className={styles.search}>
            <Search />
          </div>
        </div>

        {articles.length === 0 ? (
          <div className={styles.emptyWrap}>
            <p className={styles.emptyText}>No articles found.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {articles.map((article) => (
              <Link
                key={article.documentId}
                to="/articles/$slug"
                params={{ slug: article.slug || '' }}
              >
                <Card className={styles.card}>
                  {article.featuredImage?.url && (
                    <div className={styles.imageWrapper}>
                      <StrapiImage
                        src={article.featuredImage.url}
                        alt={
                          article.featuredImage.alternativeText || article.title
                        }
                        aspectRatio="16:9"
                        className={styles.image}
                      />
                    </div>
                  )}

                  <CardHeader className={styles.cardHeader}>
                    <div className={styles.metaRow}>
                      <time dateTime={article.publishedAt}>
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )
                          : 'No date'}
                      </time>
                    </div>

                    <h2 className={styles.cardTitle}>{article.title}</h2>
                  </CardHeader>

                  <CardContent className={styles.cardContent}>
                    <p className={styles.description}>{article.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <PaginationComponent pageCount={totalPages} />
    </div>
  )
}
