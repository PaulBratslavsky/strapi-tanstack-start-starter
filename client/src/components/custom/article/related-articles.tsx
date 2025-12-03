import { Link } from '@tanstack/react-router'
import { getStrapiMedia } from '@/lib/utils'
import type { TRelatedArticle } from '@/types'
import { Text } from '@/components/retroui/Text'

interface RelatedArticlesProps {
  articles?: Array<TRelatedArticle>
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Text as="h3" className="mb-2">Related Articles</Text>
          <Text className="text-muted-foreground">
            Continue reading with these related posts
          </Text>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const imageUrl = article.featuredImage?.url
              ? getStrapiMedia(article.featuredImage.url)
              : null

            return (
              <Link
                key={article.documentId}
                to="/articles/$slug"
                params={{ slug: article.slug }}
                className="group"
              >
                <article className="border-4 border-black bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  {/* Image */}
                  <div className="aspect-video bg-[#F9F5F2] border-b-4 border-black overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={article.featuredImage?.alternativeText || article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Text className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </Text>

                    {article.description && (
                      <Text className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {article.description}
                      </Text>
                    )}

                    {/* Author */}
                    {article.author && (
                      <div className="flex items-center gap-2 pt-3 border-t border-dashed border-black/20">
                        <div className="w-6 h-6 rounded-full bg-[#C4A1FF] border border-black flex items-center justify-center">
                          <span className="text-xs font-bold text-black">
                            {article.author.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <Text className="text-xs text-muted-foreground">
                          {article.author.fullName}
                        </Text>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
