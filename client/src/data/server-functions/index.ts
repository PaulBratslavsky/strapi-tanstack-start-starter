import { getArticlesData, getArticlesDataBySlug } from './articles'
import {
  getAuthServerFunction,
  getCurrentUserServerFunction,
  loginUserServerFunction,
  logoutUserServerFunction,
  registerUserServerFunction,
} from './auth'
import {
  createComment,
  deleteComment,
  getCommentsForArticle,
  updateComment,
} from './comments'
import { getGlobalData } from './global'
import { getPageData } from './page'
import { getLandingPageData } from './landing-page'

export const strapiApi = {
  global: {
    getGlobalData,
  },
  landingPage: {
    getLandingPageData,
  },
  page: {
    getPageData,
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
    getAuthServerFunction,
  },
  comments: {
    getCommentsForArticle,
    createComment,
    updateComment,
    deleteComment,
  },
}
