import { createServerFn } from '@tanstack/react-start'
import type { TPage, TStrapiResponseCollection } from '@/types'
import { sdk } from '@/data/strapi-sdk'

const pages = sdk.collection('pages')

export const getPageData = createServerFn({
  method: 'GET',
})
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<{ data: TPage | undefined }> => {
    const response = (await pages.find({
      filters: {
        slug: {
          $eq: slug,
        },
      },
    })) as TStrapiResponseCollection<TPage>

    return { data: response.data[0] }
  })
