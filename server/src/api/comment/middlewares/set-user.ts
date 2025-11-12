/**
 * Middleware to automatically set user from authenticated user
 * Ensures user is authenticated and sets the user relation
 */

import type { Core } from "@strapi/strapi";

export default (_config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: any) => {
    console.log("=== Start middleware ===");

    // Get the authenticated user from the request context
    const user = ctx.state.user;

    // Only apply this logic for create actions
    if (ctx.request.method === "POST") {
      // Check if user is authenticated
      if (!user) {
        return ctx.unauthorized("You must be logged in to create a comment");
      }

      const body = ctx.request.body;

      if (!body) {
        console.error("No request body found!");
        return ctx.badRequest("Request body is required");
      }

      // Set the author relation - use connect for oneToOne relations
      body.data.user = {
        connect: [{ documentId: user.documentId }],
      };

      console.log("AUser set successfully:", body.data.user);
      console.log("=== End middleware ===");
    }

    await next();
  };
};
