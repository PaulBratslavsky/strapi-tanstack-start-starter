import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { CurrentUser } from '@/lib/comment-auth'

import { CommentFeedItem } from './comment-feed-item'
import { CommentForm } from './comment-form'
import { CommentPagination } from '@/components/custom/comment-section/comment-pagination'
import { CommentSearch } from '@/components/custom/comment-section/comment-search'

import { strapiApi } from '@/data/server-functions'

interface CommentSectionProps {
  readonly articleDocumentId: string
  readonly currentUser?: CurrentUser | null
  readonly className?: string
}

export function CommentSection({
  articleDocumentId,
  currentUser,
  className = '',
}: CommentSectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 5

  const {
    data: commentsResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['comments', articleDocumentId, currentPage, searchQuery],
    queryFn: () =>
      strapiApi.comments.getCommentsForArticle({
        data: {
          articleDocumentId,
          page: currentPage,
          pageSize,
          searchQuery: searchQuery || undefined,
        },
      }),
    enabled: !!articleDocumentId,
    placeholderData: (previousData) => previousData,
  })

  const handleSearch = (term: string) => {
    setSearchQuery(term)
    setCurrentPage(1) // Reset to first page on new search
  }

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-600 dark:text-red-400 mb-4">
          <p>Failed to load comments</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred'}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  const comments = commentsResponse?.data || []
  const pagination = commentsResponse?.meta?.pagination
  const totalComments = pagination?.total || 0
  const totalPages = pagination?.pageCount || 1

  return (
    <div className={`${className}`}>
      <div className="bg-card rounded-lg shadow-sm border">
        {/* Header with Search */}
        <div className="px-6 py-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {/* Comments ({totalComments}) */}
            </h3>
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <CommentSearch onSearch={handleSearch} />

          {searchQuery.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Comment Input at Top */}
        <div className="px-6 py-4 border-b bg-muted/30">
          <CommentForm
            articleDocumentId={articleDocumentId}
            currentUser={currentUser}
            onSuccess={() => {
              refetch()
              setCurrentPage(1)
            }}
          />
        </div>

        {/* Comments Feed */}
        <div className="divide-y">
          {comments.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              {searchQuery ? (
                <p>No comments found matching "{searchQuery}"</p>
              ) : (
                <p>No comments yet. Be the first to comment!</p>
              )}
            </div>
          ) : (
            comments.map((comment) => (
              <CommentFeedItem
                key={comment.documentId}
                comment={comment}
                currentUser={currentUser}
                onUpdate={() => refetch()}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <CommentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
