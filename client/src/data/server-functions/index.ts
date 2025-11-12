import { getArticlesData, getArticlesDataBySlug } from './articles'
import {
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
import { getLandingPageData } from './landing-page'

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
  },
  comments: {
    getCommentsForArticle,
    createComment,
    updateComment,
    deleteComment,
  },
}
