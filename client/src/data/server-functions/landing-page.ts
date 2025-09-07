import type { TStrapiResponse, TLandingPage } from '@/types'
import { createServerFn } from '@tanstack/react-start'
import { api } from '../data-api'
import { getStrapiURL } from '@/lib/utils'

export const getLandingPageData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponse<TLandingPage>> => {
  const baseUrl = getStrapiURL()
  const url = new URL('/api/landing-page', baseUrl)
  return await api.get<TLandingPage>(url.href)
})
