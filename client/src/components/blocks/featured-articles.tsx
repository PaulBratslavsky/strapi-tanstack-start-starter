import { Link } from '@tanstack/react-router'
import type { IArticleDetail } from '../custom/article-detail'

export interface IFeaturedArticles {
  __component: 'blocks.featured-articles'
  id: number
  articles: Array<IArticleDetail>
}

const styles = {
  section: 'py-16 bg-muted/50 dark:bg-muted/20',
  sectionEmpty: 'py-16',
  container: 'container mx-auto px-4',
  containerEmpty: 'container mx-auto px-4 text-center',
  heading: 'text-3xl font-bold text-center mb-12 text-foreground',
  headingEmpty: 'text-3xl font-bold mb-6 text-foreground',
  subtextEmpty: 'text-muted-foreground',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  card: 'bg-card border border-border rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-300 overflow-hidden',
  image: 'w-full h-48 object-cover',
  content: 'p-6',
  title: 'text-xl font-semibold mb-3 text-card-foreground',
  description: 'text-muted-foreground mb-4 line-clamp-3',
  link: 'text-primary hover:text-primary/80 font-medium transition-colors',
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
              <div key={article.documentId || index} className={styles.card}>
                <Link
                  to="/articles/$slug"
                  params={{ slug: article.slug }}
                  className={styles.link}
                >
                  <div className={styles.content}>
                    <h3 className={styles.title}>{article.title}</h3>
                    <p className={styles.description}>{article.description}</p>
                    Read more →
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
