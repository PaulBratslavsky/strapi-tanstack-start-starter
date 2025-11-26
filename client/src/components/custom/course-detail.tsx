'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ReactPlayer from 'react-player'
import { MarkdownContent } from './markdown-content'
import { PageBreadcrumb } from './page-breadcrumb'
import type { TCourse, TLesson } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { strapiApi } from '@/data/server-functions'
import { cn } from '@/lib/utils'

const styles = {
  root: 'min-h-screen',
  headerWrapper: 'bg-card border-b-2 border-border',
  headerContainer: 'container mx-auto px-6 py-8',
  breadcrumb: 'mb-8',
  titleWrapper: 'flex items-center gap-4 mb-6',
  title: 'text-4xl lg:text-5xl font-bold text-foreground leading-tight font-heading',
  premiumBadge: 'text-sm',
  description: 'text-lg text-muted-foreground leading-relaxed',

  mainContainer: 'container mx-auto px-6 py-8',
  contentGrid: 'grid grid-cols-1 lg:grid-cols-3 gap-8',

  videoSection: 'lg:col-span-2',
  videoWrapper: 'aspect-video bg-black rounded-lg overflow-hidden mb-6',
  videoPlaceholder: 'w-full h-full flex items-center justify-center text-white/60',

  lessonInfo: 'mb-6',
  lessonTitle: 'text-2xl font-bold text-foreground mb-2 font-heading',
  lessonDescription: 'text-muted-foreground',

  contentCard: 'rounded-lg p-6 lg:p-8 bg-card border-2 border-border',
  contentTitle: 'text-xl font-bold text-foreground mb-4 font-heading',
  resourcesTitle: 'text-xl font-bold text-foreground mb-4 mt-8 pt-8 border-t-2 border-border font-heading',

  sidebar: 'lg:col-span-1',
  lessonsCard: 'rounded-lg bg-card border-2 border-border sticky top-4',
  lessonsHeader: 'p-4 border-b-2 border-border',
  lessonsTitle: 'text-lg font-bold text-foreground font-heading',
  lessonsCount: 'text-sm text-muted-foreground',
  lessonsList: 'max-h-[60vh] overflow-y-auto',
  lessonItem: 'flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border last:border-b-0',
  lessonItemActive: 'bg-main/10 hover:bg-main/15',
  lessonNumber: 'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0',
  lessonNumberDefault: 'bg-muted text-muted-foreground',
  lessonNumberActive: 'bg-main text-main-foreground',
  lessonContent: 'flex-1 min-w-0',
  lessonItemTitle: 'font-medium text-foreground truncate',
  lessonItemDescription: 'text-sm text-muted-foreground truncate',
  lessonDuration: 'text-xs text-muted-foreground flex-shrink-0',

  loadingState: 'flex items-center justify-center py-12',
  spinner: 'w-6 h-6 border-2 border-main border-t-transparent rounded-full animate-spin',
}

const markdownStyles = {
  richText: 'prose prose-lg max-w-none prose-slate dark:prose-invert',
  h1: 'text-3xl font-bold mb-4 text-foreground font-heading',
  h2: 'text-2xl font-bold mb-3 text-foreground font-heading',
  h3: 'text-xl font-bold mb-3 text-foreground font-heading',
  p: 'mb-4 leading-relaxed text-foreground',
  a: 'text-main hover:text-main/80 underline underline-offset-4 font-semibold transition-colors',
  ul: 'list-disc pl-6 mb-4 space-y-2',
  ol: 'list-decimal pl-6 mb-4 space-y-2',
  li: 'leading-relaxed text-foreground',
  blockquote: 'border-l-4 border-main pl-4 italic text-muted-foreground mb-4 py-2',
  codeBlock: 'block bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-4 font-mono',
  codeInline: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground',
  pre: 'bg-muted p-4 rounded-lg overflow-x-auto mb-4',
  table: 'w-full border-collapse border border-border mb-4',
  th: 'border border-border p-2 bg-muted font-bold text-left text-foreground',
  td: 'border border-border p-2 text-foreground',
  img: 'max-w-full h-auto rounded-lg mb-4',
  hr: 'border-border my-8',
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function CourseDetail(props: TCourse) {
  const { title, description, isPremium, lessons } = props
  const [selectedLessonSlug, setSelectedLessonSlug] = useState<string | null>(
    lessons?.[0]?.slug || null
  )

  const {
    data: lessonResponse,
    isLoading: isLessonLoading,
  } = useQuery({
    queryKey: ['lesson', selectedLessonSlug],
    queryFn: () =>
      strapiApi.courses.getLessonDataBySlug({
        data: selectedLessonSlug!,
      }),
    enabled: !!selectedLessonSlug,
  })

  const currentLesson = lessonResponse?.data?.[0]
  const selectedIndex = lessons?.findIndex((l) => l.slug === selectedLessonSlug) ?? 0

  const handleLessonSelect = (lesson: TLesson) => {
    setSelectedLessonSlug(lesson.slug)
  }

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
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.contentGrid}>
          {/* Video and Content Section */}
          <div className={styles.videoSection}>
            {/* Video Player */}
            <div className={styles.videoWrapper}>
              {currentLesson?.videoUrl ? (
                <ReactPlayer
                  src={currentLesson.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                />
              ) : (
                <div className={styles.videoPlaceholder}>
                  {isLessonLoading ? (
                    <div className={styles.spinner} />
                  ) : (
                    <span>No video available</span>
                  )}
                </div>
              )}
            </div>

            {/* Current Lesson Info */}
            {currentLesson && (
              <div className={styles.lessonInfo}>
                <h2 className={styles.lessonTitle}>
                  Lesson {selectedIndex + 1}: {currentLesson.title}
                </h2>
                {currentLesson.description && (
                  <p className={styles.lessonDescription}>
                    {currentLesson.description}
                  </p>
                )}
              </div>
            )}

            {/* Lesson Content */}
            <Card className={styles.contentCard}>
              {isLessonLoading ? (
                <div className={styles.loadingState}>
                  <div className={styles.spinner} />
                </div>
              ) : currentLesson?.content ? (
                <>
                  <h3 className={styles.contentTitle}>Lesson Content</h3>
                  <MarkdownContent
                    content={currentLesson.content}
                    styles={markdownStyles}
                  />
                  {currentLesson.resources && (
                    <>
                      <h3 className={styles.resourcesTitle}>Resources</h3>
                      <MarkdownContent
                        content={currentLesson.resources}
                        styles={markdownStyles}
                      />
                    </>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">
                  Select a lesson to view its content.
                </p>
              )}
            </Card>
          </div>

          {/* Lessons Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.lessonsCard}>
              <div className={styles.lessonsHeader}>
                <h3 className={styles.lessonsTitle}>Course Lessons</h3>
                <p className={styles.lessonsCount}>
                  {lessons?.length || 0} lessons
                </p>
              </div>
              <div className={styles.lessonsList}>
                {lessons?.map((lesson, index) => {
                  const isActive = lesson.slug === selectedLessonSlug
                  return (
                    <button
                      key={lesson.documentId}
                      onClick={() => handleLessonSelect(lesson)}
                      className={cn(
                        styles.lessonItem,
                        isActive && styles.lessonItemActive
                      )}
                    >
                      <span
                        className={cn(
                          styles.lessonNumber,
                          isActive
                            ? styles.lessonNumberActive
                            : styles.lessonNumberDefault
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className={styles.lessonContent}>
                        <h4 className={styles.lessonItemTitle}>{lesson.title}</h4>
                        {lesson.description && (
                          <p className={styles.lessonItemDescription}>
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      {lesson.videoTimecode && (
                        <span className={styles.lessonDuration}>
                          {formatDuration(lesson.videoTimecode)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
