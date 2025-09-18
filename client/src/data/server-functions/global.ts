import { createServerFn } from '@tanstack/react-start'
import type { TGlobal, TStrapiResponseSingle } from '@/types'
import { sdk } from '@/data/strapi-sdk'

const getGlobal = async () =>
  sdk.single('global').find() as Promise<TStrapiResponseSingle<TGlobal>>

export const getGlobalData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponseSingle<TGlobal>> => {
  const response = await getGlobal()
  console.log(response)
  return response
})
