import { Calendar } from "lucide-react";
import { StrapiImage } from "../strapi-image";
import { PageBreadcrumb } from "../page-breadcrumb";
import type { TAuthor, TImage } from "../../../types";
import { getStrapiMedia } from "@/lib/utils";
import { Text } from "@/components/retroui/Text";
import { Badge } from "@/components/retroui/Badge";
import { Avatar } from "@/components/retroui/Avatar";

interface ArticleDetailProps {
  title?: string;
  description?: string;
  featuredImage?: TImage;
  author?: TAuthor;
  publishedAt?: string;
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

export function ArticleDetail({
  title,
  description,
  featuredImage,
  author,
  publishedAt,
  contentTags,
}: Readonly<ArticleDetailProps>) {
  return (
    <div className="bg-white">
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
            {description && (
              <Text className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {description}
              </Text>
            )}
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
    </div>
  );
}
