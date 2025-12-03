import type { TImage, TLink } from "@/types";
import { Badge } from "@/components/retroui/Badge";
import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
import { StrapiImage } from "@/components/custom/strapi-image";
import { SmartLink } from "@/components/custom/smart-link";
import { MarkdownContent } from "@/components/custom/markdown-content";
import { cn } from "@/lib/utils";

export interface IContentWithImage {
  __component: "blocks.content-with-image";
  id: number;
  reversed: boolean;
  heading: string;
  subHeading?: string;
  content: string;
  link: TLink | undefined;
  image: TImage;
}

const markdownStyles = {
  richText: "space-y-6",
  h1: "text-3xl lg:text-4xl font-bold mb-5 text-foreground",
  h2: "text-2xl lg:text-3xl font-bold mb-4 text-foreground",
  h3: "text-xl lg:text-2xl font-bold mb-3 text-foreground",
  p: "text-lg text-muted-foreground leading-relaxed border-l-4 border-black pl-4",
  a: "text-primary hover:text-primary/80 underline font-semibold transition-colors",
  ul: "list-disc pl-8 space-y-3 text-lg",
  ol: "list-decimal pl-8 space-y-3 text-lg",
  li: "leading-relaxed",
  blockquote: "border-l-4 border-primary pl-6 italic text-muted-foreground text-lg py-2",
  codeBlock: "block bg-muted border-2 border-border p-4 text-base overflow-x-auto font-mono",
  codeInline: "bg-muted border border-border px-2 py-1 text-base font-mono",
  pre: "bg-muted border-2 border-border p-4 overflow-x-auto",
  table: "w-full border-collapse border-2 border-border text-lg",
  th: "border-2 border-border p-3 bg-muted font-bold text-left",
  td: "border border-border p-3",
  img: "max-w-full h-auto border-2 border-border shadow mb-5",
  hr: "border-2 border-border my-10",
};

export function ContentWithImage(props: Readonly<IContentWithImage>) {
  const { reversed, heading, subHeading, content, link, image } = props;
  const alt = image.alternativeText || heading || "Content image";

  return (
    <section className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-12 items-center",
            reversed && "md:[&>*:first-child]:order-2"
          )}
        >
          {/* Content Section */}
          <div className="space-y-8">
            {subHeading && (
              <Badge variant="solid" className="inline-block font-medium">
                {subHeading}
              </Badge>
            )}

            <Text as="h2">{heading}</Text>

            <MarkdownContent content={content} styles={markdownStyles} />

            {link?.href && link.label && (
              <Button asChild>
                <SmartLink href={link.href}>{link.label} →</SmartLink>
              </Button>
            )}
          </div>

          {/* Image Section */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-0 bg-primary transform translate-x-3 translate-y-3" />
            <div className="relative border-4 border-black bg-white overflow-hidden">
              <StrapiImage
                src={image.url}
                alt={alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
