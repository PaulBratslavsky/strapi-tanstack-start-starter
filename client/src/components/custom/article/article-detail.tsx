import { Link } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { StrapiImage } from "../strapi-image";
import type { TImage } from "../../../types";

interface ArticleDetailProps {
  title?: string;
  description?: string;
  featuredImage?: TImage;
}

const styles = {
  headerWrapper: "bg-card border-b-2 border-border bg-white dark:bg-background",
  headerContainer: "container mx-auto px-6 py-8",
  breadcrumb: "mb-8",
  title: "text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight font-heading",
  description: "text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8",
  featuredImageWrapper: "mb-8",
  featuredImage: "rounded-2xl",
};

export function ArticleDetail({ title, description, featuredImage }: Readonly<ArticleDetailProps>) {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerContainer}>
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
  );
}
