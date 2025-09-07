/**
 * page router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::page.page', {
  config: {
    find: {
      "middlewares": ["global::global-page-populate"]
    }
  }
});
