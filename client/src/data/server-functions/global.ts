import type { TStrapiResponseSingle, TGlobal } from '@/types'
import { createServerFn } from '@tanstack/react-start'
import { sdk } from "../strapi-sdk"

const getGlobal = async () => sdk.single("global").find() as Promise<TStrapiResponseSingle<TGlobal>>

export const getGlobalData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponseSingle<TGlobal>> => {
  const response = await getGlobal()
  console.log(response)
  return response;
})
