import { createServerFn } from '@tanstack/react-start'
import type { TStrapiResponseCollection } from '@/types'
import type { IArticleDetail } from '@/components/custom/article-detail'
import { sdk } from '@/data/strapi-sdk'

const PAGE_SIZE = 3;

const articles = sdk.collection('articles')

const getArticles = async (queryString?: string, page?: number) =>
  articles.find({
    sort: ['createdAt:desc'],
    pagination: {
      page: page || 1,
      pageSize: PAGE_SIZE
      ,
    },
    ...(queryString && {
      filters: {
        $or: [
          { title: { $containsi: queryString } },
          { content: { $containsi: queryString } },
        ],
      },
    }),
  }) as Promise<TStrapiResponseCollection<IArticleDetail>>

  const getArticlesBySlug = async (slug: string) =>
  articles.find({
    filters: {
      slug: {
        $eq: slug,
      },
    },
  }) as Promise<TStrapiResponseCollection<IArticleDetail>>

export const getArticlesData = createServerFn({
  method: 'GET',
})
  .validator((input?: { query?: string; page?: number }) => input)
  .handler(async ({ data }): Promise<TStrapiResponseCollection<IArticleDetail>> => {
    const response = await getArticles(data?.query, data?.page)
    console.log(response)
    return response
  })

export const getArticlesDataBySlug = createServerFn({
  method: 'GET',
})
  .validator((slug: string) => slug)
  .handler(
    async ({
      data: slug,
    }): Promise<TStrapiResponseCollection<IArticleDetail>> => {
      const response = await getArticlesBySlug(slug)
      return response
    },
  )
