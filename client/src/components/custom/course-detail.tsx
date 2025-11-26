import { MarkdownContent } from './markdown-content'
import { StrapiImage } from './strapi-image'
import { PageBreadcrumb } from './page-breadcrumb'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TCourse } from '@/types'

const styles = {
  root: 'min-h-screen',
  headerWrapper: 'bg-card border-b-2 border-border',
  headerContainer: 'container mx-auto px-6 py-8',
  breadcrumb: 'mb-8',
  titleWrapper: 'flex items-center gap-4 mb-6',
  title: 'text-4xl lg:text-6xl font-bold text-foreground leading-tight font-heading',
  premiumBadge: 'text-sm',
  description: 'text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8',
  featuredImageWrapper: 'mb-8',
  featuredImage: 'rounded-2xl',

  bodyContainer: 'my-16',
  contentCard: 'max-w-4xl mx-auto rounded-base p-8 lg:p-12 bg-white dark:bg-background shadow-shadow',

  lessonsWrapper: 'mt-8 pt-8 border-t-2 border-border',
  lessonsTitle: 'text-2xl font-bold text-foreground mb-4 font-heading',
  lessonsList: 'space-y-3',
  lessonItem: 'flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-main transition-colors',
  lessonNumber: 'flex items-center justify-center w-8 h-8 rounded-full bg-main text-main-foreground font-bold text-sm',
  lessonContent: 'flex-1',
  lessonTitle: 'font-semibold text-foreground',
  lessonDescription: 'text-sm text-muted-foreground',
  lessonDuration: 'text-sm text-muted-foreground',
}

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
}

export function CourseDetail(props: TCourse) {
  const { title, description, content, image, isPremium, lessons } = props

  return (
    <div className={styles.root}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerContainer}>
          <PageBreadcrumb
            className={styles.breadcrumb}
            segments={[
              { label: 'Courses', href: '/courses', search: { page: 1 } },
              { label: title },
            ]}
          />

          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>{title}</h1>
            {isPremium && (
              <Badge variant="default" className={styles.premiumBadge}>
                Premium
              </Badge>
            )}
          </div>
          {description && <p className={styles.description}>{description}</p>}

          {image?.url && (
            <div className={styles.featuredImageWrapper}>
              <StrapiImage
                src={image.url}
                alt={image.alternativeText || title || 'Course image'}
                aspectRatio="16:9"
                className={styles.featuredImage}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.bodyContainer}>
        <Card className={styles.contentCard}>
          {content && <MarkdownContent content={content} styles={markdownStyles} />}

          {lessons && lessons.length > 0 && (
            <div className={styles.lessonsWrapper}>
              <h2 className={styles.lessonsTitle}>
                Course Lessons ({lessons.length})
              </h2>
              <div className={styles.lessonsList}>
                {lessons.map((lesson, index) => (
                  <div key={lesson.documentId} className={styles.lessonItem}>
                    <span className={styles.lessonNumber}>{index + 1}</span>
                    <div className={styles.lessonContent}>
                      <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                      {lesson.description && (
                        <p className={styles.lessonDescription}>
                          {lesson.description}
                        </p>
                      )}
                    </div>
                    {lesson.videoTimecode && (
                      <span className={styles.lessonDuration}>
                        {Math.floor(lesson.videoTimecode / 60)}:{String(lesson.videoTimecode % 60).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
