import type { TLandingPage } from '@/types'
import { createServerFn } from '@tanstack/react-start'
import { sdk } from "../strapi-sdk"


export const getLandingPageData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<{ data: TLandingPage }> => {
  const response = await sdk.single("landing-page").find()
  return { data: response.data as TLandingPage };
})
