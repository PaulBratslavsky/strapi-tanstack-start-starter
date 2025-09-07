/**
 * landing-page router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::landing-page.landing-page', {
  config: {
    find: {
      middlewares: ["global::global-page-populate"]
    }
  }
});
