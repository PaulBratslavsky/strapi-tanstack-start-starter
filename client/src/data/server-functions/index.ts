import { getGlobalData } from './global'
import { getLandingPageData } from './landing-page'
import { getArticlesData, getArticlesDataBySlug } from './articles'
import {
  registerUserServerFunction,
  loginUserServerFunction,
  logoutUserServerFunction,
  getCurrentUserServerFunction
} from './auth'

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
  auth: {
    registerUserServerFunction,
    loginUserServerFunction,
    logoutUserServerFunction,
    getCurrentUserServerFunction,
  }
}
