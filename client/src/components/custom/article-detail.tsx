import type { TAuthor, TImage } from "../../types"
import { Link } from '@tanstack/react-router'
import { MarkdownContent } from "./markdown-content";
import { StrapiImage } from "./strapi-image";

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
  root: "min-h-screen bg-background",
  headerWrapper: "bg-card",
  headerContainer: "container mx-auto px-4 py-8",
  headerInner: "max-w-4xl mx-auto",
  breadcrumb: "mb-8",
  title: "text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight",
  description: "text-xl text-gray-600 leading-relaxed mb-8",
  featuredImageWrapper: "mb-8",
  featuredImage: "rounded-lg",

  bodyContainer: "container mx-auto px-4 py-4",
  bodyInner: "max-w-4xl mx-auto",
  contentCard: "bg-white rounded-lg shadow-sm p-8 lg:p-12",

  authorWrapper: "mt-6 flex items-start space-x-6",
  authorImageWrapper: "w-16 h-16 flex-shrink-0",
  authorImage: "rounded-full",
  authorName: "text-xl font-semibold text-gray-900 mb-2",
  authorBio: "text-gray-600 leading-relaxed",
};

const markdownStyles = {
  richText: "prose prose-lg max-w-none text-gray-700 dark:text-gray-300",
  h1: "text-3xl font-bold mb-6 text-gray-900 dark:text-white",
  h2: "text-2xl font-bold mb-5 text-gray-900 dark:text-white",
  h3: "text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100",
  p: "mb-6 leading-relaxed text-gray-700 dark:text-gray-300",
  a: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline",
  ul: "list-disc pl-6 mb-6 space-y-3",
  ol: "list-decimal pl-6 mb-6 space-y-3",
  li: "leading-relaxed",
  blockquote: "border-l-4 border-blue-500 pl-6 italic text-gray-600 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-800 py-4 rounded-r-lg",
  codeBlock: "block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto mb-6 border",
  codeInline: "bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono",
  pre: "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6 border",
  table: "w-full border-collapse border border-gray-300 dark:border-gray-600 mb-6",
  th: "border border-gray-300 dark:border-gray-600 p-3 bg-gray-100 dark:bg-gray-800 font-semibold text-left",
  td: "border border-gray-300 dark:border-gray-600 p-3",
  img: "max-w-full h-auto rounded-lg mb-6 shadow-sm",
  hr: "border-gray-300 dark:border-gray-600 my-8",
};

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
                    <Link to="/articles">Articles</Link>
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
                    featuredImage.alternativeText ||
                    title ||
                    "Article image"
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
          <div className={styles.contentCard}>
            <MarkdownContent content={content} styles={markdownStyles} />

            {author?.fullName && (
              <div className={styles.authorWrapper}>
                {author.image?.url && (
                  <div className={styles.authorImageWrapper}>
                    <StrapiImage
                      src={author.image.url}
                      alt={author.image.alternativeText || author.fullName}
                      aspectRatio="square"
                      className={styles.authorImage}
                      width={64}
                      height={64}
                    />
                  </div>
                )}
                <div>
                  <h3 className={styles.authorName}>About {author.fullName}</h3>
                  {author.bio && (
                    <p className={styles.authorBio}>{author.bio}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}