'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ReactPlayer from 'react-player'
import { ChevronDown } from 'lucide-react'
import { MarkdownContent } from './markdown-content'
import { PageBreadcrumb } from './page-breadcrumb'
import type { TCourse, TLesson } from '@/types'
import { strapiApi } from '@/data/server-functions'
import { Text } from '@/components/retroui/Text'
import { Badge } from '@/components/retroui/Badge'

const markdownStyles = {
  richText: 'prose prose-lg max-w-none prose-slate dark:prose-invert',
  h1: 'text-3xl font-bold mb-4 font-heading',
  h2: 'text-2xl font-bold mb-3 font-heading',
  h3: 'text-xl font-bold mb-3 font-heading',
  p: 'mb-4 leading-relaxed',
  a: 'text-main hover:text-main/80 underline underline-offset-4 font-semibold transition-colors',
  ul: 'list-disc pl-6 mb-4 space-y-2',
  ol: 'list-decimal pl-6 mb-4 space-y-2',
  li: 'leading-relaxed',
  blockquote: 'border-l-4 border-main pl-4 italic text-muted-foreground mb-4 py-2',
  codeBlock: 'block bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-4 font-mono',
  codeInline: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono',
  pre: 'bg-muted p-4 rounded-lg overflow-x-auto mb-4',
  table: 'w-full border-collapse border border-border mb-4',
  th: 'border border-border p-2 bg-muted font-bold text-left',
  td: 'border border-border p-2',
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
    lessons[0]?.slug ?? null
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

  const currentLesson = lessonResponse?.data[0]
  const selectedIndex = lessons.findIndex((l) => l.slug === selectedLessonSlug)

  const handleLessonSelect = (lesson: TLesson) => {
    setSelectedLessonSlug(lesson.slug)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F9F5F2] border-b-2 border-black">
        <div className="container mx-auto px-6 py-8">
          <PageBreadcrumb
            className="mb-8"
            segments={[
              { label: 'Courses', href: '/courses', search: { page: 1 } },
              { label: title },
            ]}
          />

          <div className="flex items-center gap-4 mb-4">
            <Text as="h2">{title}</Text>
            {isPremium && (
              <Badge size="sm" className="bg-[#C4A1FF] text-black border-2 border-black">
                Premium
              </Badge>
            )}
          </div>
          {description && (
            <Text className="text-lg text-muted-foreground max-w-2xl">
              {description}
            </Text>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video and Content Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video bg-black border-4 border-black overflow-hidden mb-6">
              {currentLesson?.videoUrl ? (
                <ReactPlayer
                  src={currentLesson.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60">
                  {isLessonLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>No video available</span>
                  )}
                </div>
              )}
            </div>

            {/* Current Lesson Info */}
            {currentLesson && (
              <div className="mb-6">
                <Text as="h3" className="mb-2">
                  Lesson {selectedIndex + 1}: {currentLesson.title}
                </Text>
                {currentLesson.description && (
                  <Text className="text-muted-foreground">
                    {currentLesson.description}
                  </Text>
                )}
              </div>
            )}

            {/* Lesson Content */}
            <div className="bg-white border-4 border-black p-6 lg:p-8 shadow-md">
              {isLessonLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : currentLesson?.content ? (
                <>
                  <Text as="h4" className="mb-4">Lesson Content</Text>
                  <MarkdownContent
                    content={currentLesson.content}
                    styles={markdownStyles}
                  />
                  {currentLesson.resources && (
                    <>
                      <Text as="h4" className="mt-8 pt-8 border-t-2 border-dashed border-black mb-4">
                        Resources
                      </Text>
                      <MarkdownContent
                        content={currentLesson.resources}
                        styles={markdownStyles}
                      />
                    </>
                  )}
                </>
              ) : (
                <Text className="text-muted-foreground">
                  Select a lesson to view its content.
                </Text>
              )}
            </div>
          </div>

          {/* Lessons Sidebar - FAQ Style */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-[#E7F193] border-4 border-black p-4 mb-4">
                <Text as="h4">Course Lessons</Text>
                <Text className="text-sm text-muted-foreground">
                  {lessons.length} lessons
                </Text>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson, index) => {
                  const isActive = lesson.slug === selectedLessonSlug
                  return (
                    <div
                      key={lesson.documentId}
                      className={`border-4 border-black transition-all duration-200 ease-in bg-white ${
                        isActive ? 'shadow-lg' : 'shadow-md'
                      }`}
                    >
                      <button
                        className="flex justify-between items-center w-full p-4 text-left font-bold focus:outline-none"
                        onClick={() => handleLessonSelect(lesson)}
                        aria-expanded={isActive}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span
                            className={`flex items-center justify-center w-8 h-8 flex-shrink-0 border-2 border-black font-bold text-sm ${
                              isActive
                                ? 'bg-[#C4A1FF] text-black'
                                : 'bg-white text-black'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {lesson.videoTimecode && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDuration(lesson.videoTimecode)}
                            </span>
                          )}
                          <ChevronDown
                            className={`transition-transform duration-200 flex-shrink-0 ${
                              isActive ? 'rotate-180' : ''
                            }`}
                            size={20}
                          />
                        </div>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isActive ? 'max-h-96 pb-4' : 'max-h-0'
                        }`}
                      >
                        {lesson.description && (
                          <div className="px-4 border-t-2 border-dashed border-black pt-3">
                            <Text className="text-sm text-muted-foreground">
                              {lesson.description}
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>
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
