import type { TStrapiResponseCollection } from '@/types'
import type { IArticleDetail } from '@/components/custom/article-detail'
import { createServerFn } from '@tanstack/react-start'
import { sdk } from '@/data/strapi-sdk'

const articles = sdk.collection('articles')
const getArticles = async () => articles.find() as Promise<TStrapiResponseCollection<IArticleDetail>>
const getArticlesBySlug = async (slug: string) => articles.find({
  filters: {
    slug: {
      $eq: slug,
    },
  },
}) as Promise<TStrapiResponseCollection<IArticleDetail>>

export const getArticlesData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponseCollection<IArticleDetail>> => {
  const response = await getArticles()
  console.log(response)
  return response
})

export const getArticlesDataBySlug = createServerFn({
  method: 'GET',
})
  .validator((slug: string) => slug)
  .handler(
    async ({ data: slug }): Promise<TStrapiResponseCollection<IArticleDetail>> => {
      const response = await getArticlesBySlug(slug)
      return response
    },
  )
