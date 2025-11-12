/**
 * comment custom routes
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/comments/custom/get-comments",
      handler: "comment.getComments",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/comments/custom/create-comment",
      handler: "comment.createComment",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
