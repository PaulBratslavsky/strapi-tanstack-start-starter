import { useState } from 'react'
import { TComment } from '@/types'
import { type CurrentUser } from '@/lib/comment-auth'
import { strapiApi } from '@/data/server-functions'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

interface CommentFeedItemProps {
  readonly comment: TComment
  readonly currentUser?: CurrentUser | null
  readonly onUpdate?: () => void
}

export function CommentFeedItem({
  comment,
  currentUser,
  onUpdate,
}: CommentFeedItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOwner = currentUser?.userId === comment.user?.id

  const handleUpdate = async () => {
    if (!editContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await strapiApi.comments.updateComment({
        data: {
          commentDocumentId: comment.documentId,
          commentData: { content: editContent },
        },
      })

      if ('error' in result) {
        console.error('Failed to update comment:', result.error)
      } else {
        setIsEditing(false)
        onUpdate?.()
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    setIsSubmitting(true)
    try {
      const result = await strapiApi.comments.deleteComment({
        data: comment.documentId,
      })

      if ('error' in result) {
        console.error('Failed to delete comment:', result.error)
      } else {
        onUpdate?.()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  })

  return (
    <div className="px-6 py-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {(comment.user?.username || 'U').charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-foreground">
              {comment.user?.username || 'Unknown User'}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-white dark:bg-gray-800 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={isSubmitting || !editContent.trim()}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-foreground whitespace-pre-wrap break-words">
                {comment.content}
              </p>

              {/* Actions */}
              {isOwner && (
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-xs text-muted-foreground hover:text-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
