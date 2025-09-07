/**
 * `global-page-populate` middleware
 */

import type { Core } from "@strapi/strapi";
import { features } from "process";

const populate = {
  blocks: {
    on: {
      "blocks.hero": {
        populate: {
          links: true,
          image: {
            fields: ["alternativeText", "url"],
          },
        },
      },
      "blocks.section-heading": true,
      "blocks.card-grid": {
        populate: {
          cards: true,
        },
      },
      "blocks.content-with-image": {
        populate: {
          link: true,
          image: {
            fields: ["alternativeText", "url"],
          },
        },
      },
      "blocks.markdown": true,
      "blocks.person-card": {
        populate: {
          image: {
            fields: ["alternativeText", "url"],
          },
        },
      },
      "blocks.faqs": {
        populate: {
          faq: true,
        },
      },
      "blocks.newsletter": true,
      "blocks.featured-articles": {
        populate: {
          articles: {
            populate: {
              featuredImage: {
                fields: ["alternativeText", "url"]
              },
              author: true,
            }
          }
        }
      },
    },
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In page-populate middleware.");
    ctx.query.populate = populate;
    await next();
  };
};
