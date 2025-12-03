import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import type { TComment } from '@/types'
import type { CurrentUser } from '@/lib/comment-auth'
import { strapiApi } from '@/data/server-functions'
import { Button } from '@/components/retroui/Button'
import { Avatar } from '@/components/retroui/Avatar'
import { Text } from '@/components/retroui/Text'
import { cn } from '@/lib/utils'

interface CommentFeedItemProps {
  readonly comment: TComment
  readonly currentUser?: CurrentUser | null
  readonly onUpdate?: () => void
}

// Color palette for avatars based on username
const avatarColors = [
  'bg-[#C4A1FF]', // Purple
  'bg-[#E7F193]', // Lime
  'bg-[#C4FF83]', // Green
  'bg-[#FFB3BA]', // Coral Pink
  'bg-[#A1D4FF]', // Sky Blue
  'bg-[#FFDAA1]', // Peach
] as const

function getAvatarColor(username: string): string {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % avatarColors.length
  return avatarColors[index]
}

export function CommentFeedItem({
  comment,
  currentUser,
  onUpdate,
}: CommentFeedItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOwner = currentUser?.id === comment.user?.id
  const username = comment.user?.username || 'Unknown User'
  const avatarColor = getAvatarColor(username)

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
    <div className="p-4 hover:bg-muted/30 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className={cn("w-10 h-10 flex-shrink-0 border-2 border-black", avatarColor)}>
          <Avatar.Fallback className={cn(avatarColor, "text-black font-bold")}>
            {username.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Text className="font-bold text-sm">
              {username}
            </Text>
            <span className="text-xs text-muted-foreground">•</span>
            <Text className="text-xs text-muted-foreground">{timeAgo}</Text>
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[80px] px-4 py-3 border-2 border-black rounded shadow-md resize-none focus:outline-none focus:shadow-sm"
                disabled={isSubmitting}
              />
              <div className="flex gap-2">
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
              {/* Message Bubble */}
              <div className="bg-[#F9F5F2] border-2 border-black rounded-lg p-3 shadow-sm">
                <Text className="whitespace-pre-wrap break-words text-sm">
                  {comment.content}
                </Text>
              </div>

              {/* Actions */}
              {isOwner && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isSubmitting}
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="w-3 h-3" />
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
