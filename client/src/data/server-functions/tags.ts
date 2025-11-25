import { createServerFn } from '@tanstack/react-start'
import type { TStrapiResponseCollection, TTag } from '@/types'
import { sdk } from '@/data/strapi-sdk'

const tags = sdk.collection('tags')

const getTags = async () =>
  tags.find({
    sort: ['createdAt:desc'],
  }) as Promise<TStrapiResponseCollection<TTag>>

export const getTagsData = createServerFn({
  method: 'GET',
})
  .handler(async (): Promise<TStrapiResponseCollection<TTag>> => {
    const response = await getTags()
    console.log(response)
    return response
  })
