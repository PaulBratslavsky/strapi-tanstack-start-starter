/**
 * `is-owner` middleware
 *
 * Ensures that users can only update/delete their own content.
 * Works with both `userId` field and `author` relation field.
 */

import type { Core } from "@strapi/strapi";

function generateUID(apiName: string) {
  return `api::${apiName}.${apiName}`;
}

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.info("In is-owner middleware.");

    const entryId = ctx.params.id;
    const user = ctx.state.user;
    const userId = user?.documentId;

    if (!userId) {
      return ctx.unauthorized(`You must be authenticated to access this entry`);
    }

    const apiName = ctx.state.route.info.apiName;

    const appUid = generateUID(apiName);

    // For update/delete operations (when entryId is present)
    if (entryId) {
      const entry = await strapi.documents(appUid as any).findOne({
        documentId: entryId,
        populate: {
          user: true, // Populate user relation if it exists
        },
      });

      if (!entry) {
        return ctx.notFound(`Entry not found`);
      }

      // Check ownership - support both userId field and user relation
      const isOwner =
        entry.userId === userId || entry.user?.documentId === userId;

      if (!isOwner) {
        return ctx.unauthorized(`You can only modify your own content`);
      }
    }

    // For find operations (when no entryId), filter by user
    if (!entryId) {
      ctx.query = {
        ...ctx.query,
        filters: {
          ...ctx.query.filters,
          // Try to filter by userId or user depending on the schema
          $or: [{ userId: userId }, { user: { documentId: userId } }],
        },
      };
    }

    await next();
  };
};
