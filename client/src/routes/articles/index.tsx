import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { strapiApi } from '@/data/server-functions'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { StrapiImage } from '@/components/custom/strapi-image'
import { Search } from '@/components/custom/search'
import { PaginationComponent } from '@/components/custom/pagination-component'
import { Tags } from '@/components/custom/tags'
import { Badge } from '@/components/ui/badge'

const articlesSearchSchema = z.object({
  query: z.string().optional(),
  page: z.number().default(1),
  tag: z.string().optional(),
})

export const Route = createFileRoute('/articles/')({
  validateSearch: articlesSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    const { query, page, tag } = deps.search
    const articlesData = await strapiApi.articles.getArticlesData({
      data: {
        query,
        page,
        tag,
      },
    })
    return { articlesData }
  },
  head: () => ({
    meta: [
      { title: 'Blog' },
      { name: 'description', content: 'Discover insights, tutorials, and stories from our team' },
    ],
  }),
  component: Articles,
})

const styles = {
  root: 'min-h-screen bg-secondary mb-16',
  container: 'container mx-auto px-4 py-16',
  search: 'container mx-auto py-4',

  header: 'text-center mb-12',
  title: 'text-4xl font-bold text-foreground mb-4',
  subtitle: 'text-xl text-foreground/70 max-w-2xl mx-auto',

  emptyWrap: 'text-center py-12',
  emptyText: 'text-foreground/70 text-lg',

  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',

  card: 'pt-0 pb-8 group hover:shadow-shadow transition-all overflow-hidden block-bg-secondary border-2 border-border rounded-lg',
  imageWrapper: 'overflow-hidden',
  image: 'group-hover:scale-105 transition-transform duration-300',

  cardHeader: 'pb-3',
  metaRow: 'flex items-center gap-2 text-sm text-foreground/60 mb-2',
  badge: 'text-xs',
  cardTitle:
    'text-xl font-semibold group-hover:text-main transition-colors line-clamp-2 text-foreground',

  cardContent: 'pt-0',
  description: 'text-foreground/70 line-clamp-3 leading-relaxed',

  cardFooter: 'pt-0',
  readMoreBtn: 'p-0 h-auto font-medium group/button',
  readMoreIcon:
    'w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform',
}

function Articles() {
  const { articlesData } = Route.useLoaderData()
  const articles = articlesData.data
  const totalPages = articlesData.meta?.pagination?.pageCount || 1

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Articles</h1>
          <p className={styles.subtitle}>
            Discover insights, tutorials, and stories from our team
          </p>
          <Tags className="justify-center mt-4" />
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
              <Card key={article.documentId} className={styles.card}>
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

                  {article.contentTags && article.contentTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.contentTags.map((tag) => (
                        <Badge key={tag.documentId} variant="neutral" className="text-xs">
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>

                <CardContent className={styles.cardContent}>
                  <p className={styles.description}>{article.description}</p>
                </CardContent>

                <CardFooter className={styles.cardFooter}>
                  <Button asChild>
                    <Link
                      key={article.documentId}
                      to="/articles/$slug"
                      params={{ slug: article.slug || '' }}
                    >
                      Read more
                      <svg
                        className={styles.readMoreIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <PaginationComponent pageCount={totalPages} />
    </div>
  )
}
