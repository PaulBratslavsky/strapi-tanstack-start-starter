import { Calendar } from "lucide-react";
import { MarkdownContentLazy } from "./markdown-content-lazy";
import { StrapiImage } from "./strapi-image";
import { PageBreadcrumb } from "./page-breadcrumb";
import type { TAuthor, TImage } from "../../types";
import { getStrapiMedia } from "@/lib/utils";
import { Text } from "@/components/retroui/Text";
import { Badge } from "@/components/retroui/Badge";
import { Avatar } from "@/components/retroui/Avatar";

export interface IArticleDetail {
  documentId: string;
  createdAt: string;
  updatedAt: string;
  title?: string;
  description?: string;
  publishedAt?: string;
  slug?: string;
  author?: TAuthor;
  featuredImage?: TImage;
  content?: string;
  contentTags?: Array<{
    id: number;
    documentId: string;
    title: string;
  }>;
}

const tagColors = [
  "bg-[#C4A1FF] text-black", // Purple
  "bg-[#E7F193] text-black", // Lime
  "bg-[#C4FF83] text-black", // Green
  "bg-[#FFB3BA] text-black", // Coral Pink
  "bg-[#A1D4FF] text-black", // Sky Blue
  "bg-[#FFDAA1] text-black", // Peach
] as const;

function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
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

const markdownStyles = {
  richText: "prose prose-lg max-w-none prose-slate dark:prose-invert",
  h1: "text-4xl lg:text-5xl font-bold mb-6 font-heading",
  h2: "text-3xl lg:text-4xl font-bold mb-5 font-heading",
  h3: "text-2xl lg:text-3xl font-bold mb-4 font-heading",
  p: "mb-6 leading-relaxed text-lg lg:text-xl",
  a: "text-main hover:text-main/80 underline underline-offset-4 font-semibold transition-colors",
  ul: "list-disc pl-8 mb-6 space-y-3 text-lg lg:text-xl",
  ol: "list-decimal pl-8 mb-6 space-y-3 text-lg lg:text-xl",
  li: "leading-relaxed",
  blockquote:
    "border-l-4 border-main pl-6 italic text-muted-foreground mb-6 bg-secondary-background py-4 rounded-r-base text-lg lg:text-xl",
  codeBlock:
    "block bg-secondary-background p-4 rounded-base text-base overflow-x-auto mb-6 border-2 border-border font-mono",
  codeInline:
    "bg-secondary-background border border-border px-2 py-1 rounded-base text-base font-mono",
  pre: "bg-secondary-background p-4 rounded-base overflow-x-auto mb-6 border-2 border-border",
  table: "w-full border-collapse border-2 border-border mb-6 text-lg",
  th: "border-2 border-border p-3 bg-secondary-background font-bold text-left",
  td: "border border-border p-3",
  img: "max-w-full h-auto rounded-base mb-6 border-2 border-border shadow-shadow",
  hr: "border-2 border-border my-12",
};

export function ArticleDetail(props: IArticleDetail) {
  const { title, description, content, featuredImage, author, contentTags, publishedAt } = props;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-8">
        <PageBreadcrumb
          segments={[
            { label: "Articles", href: "/articles", search: { page: 1 } },
            { label: title || "" },
          ]}
        />
      </div>

      {/* Hero with overlay */}
      <article className="relative bg-white border-black group mb-32">
        <div className="relative h-[480px]">
          {featuredImage?.url && (
            <StrapiImage
              src={featuredImage.url}
              alt={featuredImage.alternativeText || title || "Article image"}
              className="object-cover w-full h-full transition-transform"
            />
          )}

          {/* Overlay content */}
          <div className="absolute -bottom-20 left-8 lg:left-20 p-4 lg:p-8 bg-background max-w-xl border-2 border-black shadow hover:shadow-md">
            <div className="mb-4">
              {contentTags?.[0] && (
                <Badge
                  size="sm"
                  className={`${getTagColor(contentTags[0].title)} border-2 border-black`}
                >
                  {contentTags[0].title}
                </Badge>
              )}
            </div>
            <Text as="h3" className="mb-4 text-xl lg:text-2xl">
              {title}
            </Text>
            <div className="flex items-center">
              {author && (
                <>
                  <Avatar className="h-10 w-10 mr-3">
                    {author.image?.url && (
                      <Avatar.Image
                        src={getStrapiMedia(author.image.url)}
                        alt={author.fullName}
                      />
                    )}
                    <Avatar.Fallback>
                      {author.fullName.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                  <div>
                    <Text className="font-bold text-sm">{author.fullName}</Text>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <Text className="text-muted-foreground text-xs font-medium">
                        {formatDate(publishedAt)}
                      </Text>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-6 py-8">
        {description && (
          <Text className="text-xl text-muted-foreground leading-relaxed mb-8">
            {description}
          </Text>
        )}

        <div className="bg-white border-2 border-black p-8 lg:p-12 shadow">
          <MarkdownContentLazy content={content} styles={markdownStyles} />

          {author?.fullName && (
            <div className="mt-8 flex items-start space-x-6 pt-8 border-t-2 border-black">
              <Avatar className="w-16 h-16">
                {author.image?.url && (
                  <Avatar.Image
                    src={getStrapiMedia(author.image.url)}
                    alt={author.fullName}
                  />
                )}
                <Avatar.Fallback>
                  {author.fullName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </Avatar.Fallback>
              </Avatar>
              <div>
                <Text as="h4" className="font-bold mb-2">
                  About {author.fullName}
                </Text>
                {author.bio && (
                  <Text className="text-muted-foreground leading-relaxed">
                    {author.bio}
                  </Text>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
