import qs from 'qs'
import type { TStrapiResponse } from '@/types'
import type { IArticleDetail } from '@/components/custom/article-detail'
import { createServerFn } from '@tanstack/react-start'
import { api } from '../data-api'
import { getStrapiURL } from '@/lib/utils'

export const getArticlesData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponse<IArticleDetail[]>> => {
  const baseUrl = getStrapiURL()
  const url = new URL('/api/articles', baseUrl)
  return await api.get<IArticleDetail[]>(url.href)
})

export const getArticlesDataBySlug = createServerFn({
  method: 'GET',
})
  .validator((slug: string) => slug)
  .handler(
    async ({ data: slug }): Promise<TStrapiResponse<IArticleDetail[]>> => {
      const baseUrl = getStrapiURL()
      const url = new URL('/api/articles', baseUrl)

      url.search = qs.stringify({
        filters: {
          slug: {
            $eq: slug,
          },
        },
      })

      return await api.get<IArticleDetail[]>(url.href)
    },
  )
