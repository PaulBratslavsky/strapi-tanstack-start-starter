/**
 * `article-populate` middleware
 */

import type { Core } from "@strapi/strapi";

const populate = {
  featuredImage: {
    fields: ["url", "alternativeText"],
  },
  author: {
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      articles: {
        fields: ["documentId", "title"],
      },
    },
  },
  contentTags: true,
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
    },
  },
  relatedArticles: {
    populate: {
      featuredImage: {
        fields: ["alternativeText", "url"],
      },
      author: true,
    },
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In article-populate middleware.");
    ctx.query.populate = populate;
    await next();
  };
};
