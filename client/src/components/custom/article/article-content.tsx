import type { TAuthor } from "@/types";
import { MarkdownContent } from "@/components/custom/markdown-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getStrapiMedia } from "@/lib/utils";

interface ArticleContentProps {
  content?: string;
  author?: TAuthor;
}

const styles = {
  bodyContainer: "my-16",
  contentCard: "max-w-4xl mx-auto rounded-base p-8 lg:p-12 bg-white dark:bg-background shadow-shadow",
  authorWrapper: "mt-8 flex items-start space-x-6 pt-8 border-t-2 border-border",
  authorName: "text-2xl font-bold text-foreground mb-2 font-heading",
  authorBio: "text-lg text-muted-foreground leading-relaxed",
};

const markdownStyles = {
  richText: 'prose prose-lg max-w-none prose-slate dark:prose-invert',
  h1: 'text-4xl lg:text-5xl font-bold mb-6 text-foreground font-heading',
  h2: 'text-3xl lg:text-4xl font-bold mb-5 text-foreground font-heading',
  h3: 'text-2xl lg:text-3xl font-bold mb-4 text-foreground font-heading',
  p: 'mb-6 leading-relaxed text-foreground text-lg lg:text-xl',
  a: 'text-main hover:text-main/80 underline underline-offset-4 font-semibold transition-colors',
  ul: 'list-disc pl-8 mb-6 space-y-3 text-lg lg:text-xl',
  ol: 'list-decimal pl-8 mb-6 space-y-3 text-lg lg:text-xl',
  li: 'leading-relaxed text-foreground',
  blockquote:
    'border-l-4 border-main pl-6 italic text-muted-foreground mb-6 bg-secondary-background py-4 rounded-r-base text-lg lg:text-xl',
  codeBlock:
    'block bg-secondary-background p-4 rounded-base text-base overflow-x-auto mb-6 border-2 border-border font-mono',
  codeInline: 'bg-secondary-background border border-border px-2 py-1 rounded-base text-base font-mono text-foreground',
  pre: 'bg-secondary-background p-4 rounded-base overflow-x-auto mb-6 border-2 border-border',
  table: 'w-full border-collapse border-2 border-border mb-6 text-lg',
  th: 'border-2 border-border p-3 bg-secondary-background font-bold text-left text-foreground',
  td: 'border border-border p-3 text-foreground',
  img: 'max-w-full h-auto rounded-base mb-6 border-2 border-border shadow-shadow',
  hr: 'border-2 border-border my-12',
};

export function ArticleContent({ content, author }: Readonly<ArticleContentProps>) {
  return (
    <div className={styles.bodyContainer}>
      <Card className={styles.contentCard}>
        <MarkdownContent content={content} styles={markdownStyles} />

        {author?.fullName && (
          <div className={styles.authorWrapper}>
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={author.image?.url ? getStrapiMedia(author.image.url) : undefined}
                alt={author.image?.alternativeText || author.fullName}
              />
              <AvatarFallback>
                {author.fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className={styles.authorName}>About {author.fullName}</h3>
              {author.bio && (
                <p className={styles.authorBio}>{author.bio}</p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
