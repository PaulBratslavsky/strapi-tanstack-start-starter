/**
 * comment controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::comment.comment",
  ({ strapi }) => ({
    // Custom method: Create comment with user set from authenticated user
    async createComment(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in to comment");
      }

      const { data } = ctx.request.body;

      console.log("Creating comment with data:", data);

      // Create comment with user set server-side
      const entity = await strapi.documents("api::comment.comment").create({
        data: {
          ...data,
          user: {
            connect: [{ documentId: user.documentId }],
          },
        },
        populate: {
          user: {
            fields: ["username"],
          },
        },
      });

      console.log("Comment created:", entity);

      // Sanitize response
      const sanitizedEntity = {
        ...entity,
        user: entity.user
          ? {
              id: entity.user.id,
              documentId: entity.user.documentId,
              username: entity.user.username,
            }
          : null,
      };

      return { data: sanitizedEntity };
    },

    // Custom method: Find comments with user username populated (for custom route)
    async getComments(ctx) {
      const { query } = ctx;

      console.log("Raw query:", JSON.stringify(query, null, 2));

      // Build the query params directly from ctx.query to preserve relation filters
      const queryParams = {
        filters: query.filters || {},
        sort: query.sort || [],
        populate: {
          user: {
            fields: ["username"],
          },
        },
        pagination: query.pagination || { page: 1, pageSize: 25 },
      };

      console.log("Query params:", JSON.stringify(queryParams, null, 2));

      // Use the service layer to get entities with pagination
      const { results, pagination } = await strapi
        .service("api::comment.comment")
        .find(queryParams);

      console.log("Found comments:", results.length);

      // Sanitize to only include username from user
      const sanitizedEntities = results.map((entity: any) => ({
        ...entity,
        user: entity.user
          ? {
              id: entity.user.id,
              documentId: entity.user.documentId,
              username: entity.user.username,
            }
          : null,
      }));

      return {
        data: sanitizedEntities,
        meta: { pagination },
      };
    },
  })
);
