import type { TAuthor, TImage } from "../../types";
import { Link } from '@tanstack/react-router'
import { MarkdownContent } from "./markdown-content";
import { StrapiImage } from "./strapi-image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

import { getStrapiMedia } from "@/lib/utils";

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
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const styles = {
  root: "min-h-screen",
  headerWrapper: "bg-card border-b border-border",
  headerContainer: "container mx-auto px-4 py-8",
  headerInner: "max-w-4xl mx-auto",
  breadcrumb: "mb-8",
  title: "text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight",
  description: "text-xl text-muted-foreground leading-relaxed mb-8",
  featuredImageWrapper: "mb-8",
  featuredImage: "rounded-lg",

  bodyContainer: "container mx-auto px-4 py-4",
  bodyInner: "max-w-4xl mx-auto",
  contentCard: "rounded-lg p-8 lg:p-12 bg-card border border-border bg-white dark:bg-background",

  authorWrapper: "mt-6 flex items-start space-x-6 pt-6 border-t border-border",
  authorImageWrapper: "w-16 h-16 flex-shrink-0",
  authorImage: "rounded-full",
  authorName: "text-xl font-semibold text-foreground mb-2",
  authorBio: "text-muted-foreground leading-relaxed",
};

const markdownStyles = {
  richText: 'prose prose-lg max-w-none prose-slate dark:prose-invert',
  h1: 'text-3xl font-bold mb-6 text-foreground',
  h2: 'text-2xl font-bold mb-5 text-foreground',
  h3: 'text-xl font-semibold mb-4 text-foreground',
  p: 'mb-6 leading-relaxed text-foreground',
  a: 'text-primary hover:text-primary/80 underline underline-offset-4',
  ul: 'list-disc pl-6 mb-6 space-y-3',
  ol: 'list-decimal pl-6 mb-6 space-y-3',
  li: 'leading-relaxed text-foreground',
  blockquote:
    'border-l-4 border-primary pl-6 italic text-muted-foreground mb-6 bg-muted py-4 rounded-r-lg',
  codeBlock:
    'block bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6 border',
  codeInline: 'bg-muted px-2 py-1 rounded text-sm font-mono text-foreground',
  pre: 'bg-muted p-4 rounded-lg overflow-x-auto mb-6 border',
  table: 'w-full border-collapse border border-border mb-6',
  th: 'border border-border p-3 bg-muted font-semibold text-left text-foreground',
  td: 'border border-border p-3 text-foreground',
  img: 'max-w-full h-auto rounded-lg mb-6 shadow-sm',
  hr: 'border-border my-8',
}


export function ArticleDetail(props: IArticleDetail) {
  const { title, description, content, featuredImage, author } = props;

  return (
    <div className={styles.root}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.headerInner}>
            {/* Breadcrumb */}
            <Breadcrumb className={styles.breadcrumb}>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/articles" search={{ page: 1 }}>
                      Articles
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>

            {featuredImage?.url && (
              <div className={styles.featuredImageWrapper}>
                <StrapiImage
                  src={featuredImage.url}
                  alt={
                    featuredImage.alternativeText || title || "Article image"
                  }
                  aspectRatio="16:9"
                  className={styles.featuredImage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bodyContainer}>
        <div className={styles.bodyInner}>
          <Card className={styles.contentCard}>
            <MarkdownContent content={content} styles={markdownStyles}/>

            {author?.fullName && (
              <div className={styles.authorWrapper}>
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={author.image?.url ? getStrapiMedia(author.image.url) : undefined}
                    alt={author.image?.alternativeText || author.fullName}
                  />
                  <AvatarFallback>
                    {author.fullName
                      ?.split(" ")
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
      </div>
    </div>
  );
}
