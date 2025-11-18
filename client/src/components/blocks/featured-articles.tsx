import { Link } from '@tanstack/react-router'
import type { IArticleDetail } from '../custom/article-detail'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface IFeaturedArticles {
  __component: 'blocks.featured-articles'
  id: number
  articles: Array<IArticleDetail>
}

const styles = {
  section: 'py-16 bg-secondary-background dark:bg-dark',
  container: 'container mx-auto px-4',
  heading: 'text-3xl text-foreground font-bold text-center mb-12',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  card: 'bg-background border-2 border-border rounded-lg overflow-hidden hover:shadow-shadow transition-all shadow-shadow',
  image: 'w-full h-48 object-cover',
  content: 'p-6',
  title: 'text-xl font-semibold mb-3 text-foreground',
  description: 'text-foreground/70 mb-4 line-clamp-3',
  link: 'text-main hover:text-main/80 font-medium',
}

export function FeaturedArticles(props: Readonly<IFeaturedArticles>) {
  const { articles } = props
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Featured Articles</h2>
        <div className={styles.grid}>
          {articles.map((article, index) => {
            if (!article.slug) return null
            return (
              <Card key={article.documentId || index} className={styles.card}>
                <div className={styles.content}>
                  <h3 className={styles.title}>{article.title}</h3>
                  <p className={styles.description}>{article.description}</p>
                  <Button asChild>
                    <Link
                      to="/articles/$slug"
                      params={{ slug: article.slug }}
                      className={styles.link}
                    >
                      Read more →
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
