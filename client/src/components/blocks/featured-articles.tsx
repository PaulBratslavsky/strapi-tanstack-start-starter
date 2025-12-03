import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import type { IArticleDetail } from "@/components/custom/article-detail";
import { Text } from "@/components/retroui/Text";
import { Badge } from "@/components/retroui/Badge";
import { Button } from "@/components/retroui/Button";
import { Avatar } from "@/components/retroui/Avatar";
import { StrapiImage } from "@/components/custom/strapi-image";
import { getStrapiMedia } from "@/lib/utils";

export interface IFeaturedArticles {
  __component: "blocks.featured-articles";
  id: number;
  articles: Array<IArticleDetail>;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FeaturedArticles(props: Readonly<IFeaturedArticles>) {
  const { articles } = props;

  if (articles.length === 0) return null;

  const featuredPost = articles[0];
  const regularPosts = articles.slice(1);

  return (
    <section className="py-24 px-4">
      <div className="container px-4 mx-auto">
        <div className="mb-16 text-center">
          <Text as="h2" className="mb-2">
            From Our Blog
          </Text>
          <Text className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, thoughts, and explorations on design, development, and
            digital trends.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 min-h-[600px]">
          {/* Featured post - takes up more space */}
          {featuredPost.slug && (
            <article className="lg:col-span-8 border-4 bg-white shadow-lg group transition-all">
              <div className="grid md:grid-cols-2 h-full">
                <div className="relative border-b-4 md:border-b-0 md:border-r-3 border-black">
                  {featuredPost.featuredImage && (
                    <StrapiImage
                      src={featuredPost.featuredImage.url}
                      alt={
                        featuredPost.featuredImage.alternativeText ||
                        featuredPost.title ||
                        "Featured article"
                      }
                      className="object-cover h-full w-full"
                    />
                  )}
                  <Badge className="absolute top-0 left-0" variant="surface">
                    FEATURED
                  </Badge>
                </div>
                <div className="p-8 flex flex-col items-start">
                  <div className="flex items-center space-x-4 mb-6">
                    {featuredPost.contentTags?.[0] && (
                      <Badge variant="solid" size="sm">
                        {featuredPost.contentTags[0].title}
                      </Badge>
                    )}
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2" />
                      {formatDate(featuredPost.publishedAt)}
                    </div>
                  </div>
                  <Text
                    as="h3"
                    className="mb-4 group-hover:underline decoration-primary decoration-4 transition-all duration-300 underline-offset-4"
                  >
                    {featuredPost.title}
                  </Text>
                  <Text className="mb-6 line-clamp-3">
                    {featuredPost.description}
                  </Text>
                  <div className="flex grow items-start">
                    {featuredPost.author && (
                      <div className="flex items-center space-x-2 mb-6">
                        <Avatar className="h-10 w-10">
                          {featuredPost.author.image && (
                            <Avatar.Image
                              src={getStrapiMedia(featuredPost.author.image.url)}
                              alt={featuredPost.author.fullName}
                            />
                          )}
                          <Avatar.Fallback>
                            {featuredPost.author.fullName.charAt(0)}
                          </Avatar.Fallback>
                        </Avatar>
                        <span className="font-medium">
                          {featuredPost.author.fullName}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/articles/$slug"
                    params={{ slug: featuredPost.slug }}
                  >
                    <Button>
                      Read Article
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          )}

          {/* Sidebar with recent posts */}
          {regularPosts.length > 0 && (
            <div className="lg:col-span-4 flex flex-col gap-6">
              {regularPosts.map((post) => {
                if (!post.slug) return null;
                return (
                  <Link
                    key={post.documentId}
                    to="/articles/$slug"
                    params={{ slug: post.slug }}
                    className="block"
                  >
                    <article className="border-2 bg-white p-6 shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-md transition-all group h-full">
                      <div className="flex items-center mb-2 space-x-4">
                        {post.contentTags?.[0] && (
                          <Badge variant="solid" size="sm">
                            {post.contentTags[0].title}
                          </Badge>
                        )}
                        <div className="text-sm flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                      <Text
                        as="h4"
                        className="font-sans font-bold mb-4 group-hover:underline decoration-primary decoration-3 transition-all duration-300 underline-offset-2"
                      >
                        {post.title}
                      </Text>
                      {post.author && (
                        <div className="flex items-center">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-black mr-2 bg-[#C4A1FF] flex items-center justify-center">
                            {post.author.image ? (
                              <img
                                src={getStrapiMedia(post.author.image.url)}
                                alt={post.author.fullName}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-xs font-bold">
                                {post.author.fullName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {post.author.fullName}
                          </span>
                        </div>
                      )}
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-16">
          <Link to="/articles">
            <Button size="lg" variant="outline">
              Browse All Articles
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
