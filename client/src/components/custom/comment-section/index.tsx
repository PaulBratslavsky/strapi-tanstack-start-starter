import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { CommentFeedItem } from './comment-feed-item'
import { CommentForm } from './comment-form'
import type { CurrentUser } from '@/lib/comment-auth'
import { CommentPagination } from '@/components/custom/comment-section/comment-pagination'
import { CommentSearch } from '@/components/custom/comment-section/comment-search'

import { strapiApi } from '@/data/server-functions'

interface CommentSectionProps {
  readonly articleDocumentId: string
  readonly currentUser?: CurrentUser | null
  readonly className?: string
}

const styles = {
  container: 'container mx-auto px-4 py-8',
  maxWidth: 'max-w-4xl mx-auto',
  loadingRoot: 'animate-pulse',
  loadingContent: 'space-y-4',
  loadingHeader: 'h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4',
  loadingItems: 'space-y-3',
  loadingItem: 'h-20 bg-gray-200 dark:bg-gray-700 rounded',
  errorRoot: 'text-center py-8',
  errorMessage: 'text-red-600 dark:text-red-400 mb-4',
  errorDetails: 'text-sm text-gray-500 dark:text-gray-400',
  retryButton: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors',
  card: 'bg-card rounded-lg shadow-sm border',
  header: 'px-6 py-4 border-b space-y-4',
  headerTop: 'flex items-center justify-between',
  heading: 'text-lg font-semibold text-foreground',
  loadingIndicator: 'flex items-center gap-2 text-sm text-muted-foreground',
  spinner: 'w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin',
  searchResults: 'text-sm text-muted-foreground',
  commentFormContainer: 'px-6 py-4 border-b bg-muted/30',
  commentsFeed: 'divide-y',
  emptyState: 'px-6 py-12 text-center text-muted-foreground',
  paginationContainer: 'px-6 py-4 border-t',
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
      <div className={styles.container}>
        <div className={styles.maxWidth}>
          <div className={`${styles.loadingRoot} ${className}`}>
            <div className={styles.loadingContent}>
              <div className={styles.loadingHeader}></div>
              <div className={styles.loadingItems}>
                <div className={styles.loadingItem}></div>
                <div className={styles.loadingItem}></div>
                <div className={styles.loadingItem}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.maxWidth}>
          <div className={`${styles.errorRoot} ${className}`}>
            <div className={styles.errorMessage}>
              <p>Failed to load comments</p>
              <p className={styles.errorDetails}>
                {error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred'}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const comments = commentsResponse?.data || []
  const pagination = commentsResponse?.meta?.pagination
  const totalComments = pagination?.total || 0
  const totalPages = pagination?.pageCount || 1

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        <div className={`${className}`}>
          <div className={styles.card}>
            {/* Header with Search */}
            <div className={styles.header}>
              <div className={styles.headerTop}>
                <h3 className={styles.heading}>
                  Comments ({totalComments})
                </h3>
                {isFetching && (
                  <div className={styles.loadingIndicator}>
                    <div className={styles.spinner} />
                    <span>Loading...</span>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <CommentSearch onSearch={handleSearch} />

              {searchQuery.length > 0 && (
                <p className={styles.searchResults}>
                  Showing results for "{searchQuery}"
                </p>
              )}
            </div>

            {/* Comment Input at Top */}
            <div className={styles.commentFormContainer}>
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
            <div className={styles.commentsFeed}>
              {comments.length === 0 ? (
                <div className={styles.emptyState}>
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
              <div className={styles.paginationContainer}>
                <CommentPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
