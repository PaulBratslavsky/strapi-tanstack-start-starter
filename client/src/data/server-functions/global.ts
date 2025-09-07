import type { TStrapiResponse, TGlobal } from '@/types'
import { createServerFn } from '@tanstack/react-start'
import { api } from '../data-api'
import { getStrapiURL } from '@/lib/utils'

export const getGlobalData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponse<TGlobal>> => {
  const baseUrl = getStrapiURL()
  const url = new URL('/api/global', baseUrl)
  return await api.get<TGlobal>(url.href)
})
