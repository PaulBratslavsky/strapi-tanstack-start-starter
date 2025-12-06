import { createServerFn } from '@tanstack/react-start'
import type { TStrapiResponseCollection } from '@/types'
import type { IArticleDetail } from '@/components/custom/article-detail'
import { sdk } from '@/data/strapi-sdk'

const PAGE_SIZE = 6;

const articles = sdk.collection('articles')

const getArticles = async (queryString?: string, page?: number, tag?: string) => {
  const filterConditions: Array<Record<string, unknown>> = []

  if (queryString) {
    filterConditions.push({
      $or: [
        { title: { $containsi: queryString } },
        { content: { $containsi: queryString } },
      ],
    })
  }

  if (tag) {
    filterConditions.push({
      contentTags: {
        title: { $containsi: tag },
      },
    })
  }

  const filters = filterConditions.length === 0
    ? undefined
    : filterConditions.length === 1
      ? filterConditions[0]
      : { $and: filterConditions }

  return articles.find({
    sort: ['createdAt:desc'],
    pagination: {
      page: page || 1,
      pageSize: PAGE_SIZE,
    },
    populate: {
      contentTags: {
        fields: ['title'],
      },
    },
    filters,
  }) as Promise<TStrapiResponseCollection<IArticleDetail>>
}

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
  .inputValidator((input?: { query?: string; page?: number; tag?: string }) => input)
  .handler(async ({ data }): Promise<TStrapiResponseCollection<IArticleDetail>> => {
    const response = await getArticles(data?.query, data?.page, data?.tag)
    return response
  })

export const getArticlesDataBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator((slug: string) => slug)
  .handler(
    async ({
      data: slug,
    }): Promise<TStrapiResponseCollection<IArticleDetail>> => {
      const response = await getArticlesBySlug(slug)
      return response
    },
  )
