import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea";
import { strapiApi } from '@/data/server-functions'
import { handleAuthError, isAuthenticated, type CurrentUser } from '@/lib/comment-auth'
import type { TCommentCreate } from '@/types'

interface CommentFormProps {
  readonly articleDocumentId: string
  readonly currentUser?: CurrentUser | null
  readonly onSuccess?: () => void
  readonly placeholder?: string
  readonly className?: string
}

export function CommentForm({
  articleDocumentId,
  currentUser,
  onSuccess,
  placeholder = "What are your thoughts?",
  className = ""
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const createCommentMutation = useMutation({
    mutationFn: async (commentData: TCommentCreate) => {
      const result = await strapiApi.comments.createComment({ data: commentData })
      if ('error' in result) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (result) => {
      // Invalidate and refetch comments
      console.log(result)
      queryClient.invalidateQueries({ queryKey: ['comments', articleDocumentId] })
      setContent('')
      setError(null)
      onSuccess?.()
    },
    onError: (error) => {
      setError(handleAuthError(error))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }

    if (content.length > 1000) {
      setError('Comment must be 1000 characters or less')
      return
    }

    setError(null)

    const commentData: TCommentCreate = {
      content: content.trim(),
      articleId: articleDocumentId,
    }

    createCommentMutation.mutate(commentData)
  }

  // Show authentication prompt for unauthenticated users
  if (!isAuthenticated(currentUser)) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center ${className}`}>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please sign in to join the conversation
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="default">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    )
  }

  const characterCount = content.length
  const isOverLimit = characterCount > 1000
  const isNearLimit = characterCount > 900

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`w-full px-3 py-2 resize-none transition-colors
            ${isOverLimit 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
            }
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2
          `}
          disabled={createCommentMutation.isPending}
        />
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            {error && (
              <span className="text-red-600 dark:text-red-400">
                {error}
              </span>
            )}
          </div>
          
          <span className={`
            ${isOverLimit 
              ? 'text-red-600 dark:text-red-400 font-medium' 
              : isNearLimit 
                ? 'text-yellow-600 dark:text-yellow-400' 
                : 'text-gray-500 dark:text-gray-400'
            }
          `}>
            {characterCount}/1000
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="submit"
          disabled={createCommentMutation.isPending || !content.trim() || isOverLimit}
        >
          {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  )
}