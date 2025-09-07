import { getGlobalData } from './global'
import { getLandingPageData } from './landing-page'
import { getArticlesData, getArticlesDataBySlug } from './articles'

export const strapiApi = {
  global: {
    getGlobalData,
  },
  landingPage: {
    getLandingPageData,
  },
  articles: {
    getArticlesData,
    getArticlesDataBySlug,
  },
}
