import { createServerFn } from '@tanstack/react-start'
import qs from 'qs'

import type {
  TCommentCreate,
  TCommentResponse,
  TCommentSingleResponse,
  TCommentUpdate,
} from '@/types'

import { useAppSession } from '@/lib/session'
import { getAuthenticatedCollection, sdk } from '@/data/strapi-sdk'

// Get comments for a specific article using Strapi SDK custom route (public access)
const getCommentsForArticleInternal = async (
  articleDocumentId: string,
  page: number = 1,
  pageSize: number = 5,
  searchQuery?: string,
): Promise<TCommentResponse> => {
  // Build query object
  const query = {
    filters: {
      articleId: {
        $eq: articleDocumentId,
      },
      ...(searchQuery &&
        searchQuery.trim() && {
          $or: [
            {
              user: {
                username: {
                  $containsi: searchQuery.trim(),
                },
              },
            },
            {
              content: {
                $containsi: searchQuery.trim(),
              },
            },
          ],
        }),
    },
    populate: {
      user: {
        fields: ['username', 'email'],
      },
    },
    pagination: {
      page,
      pageSize,
    },
    sort: ['createdAt:desc'],
  }

  // Stringify query using qs
  const queryString = qs.stringify(query, { encodeValuesOnly: true })

  // Use SDK fetch for custom route
  const response = await sdk.fetch(
    `comments/custom/get-comments?${queryString}`,
    {
      method: 'GET',
    },
  )

  return response.json()
}

// Create a new comment
const createCommentInternal = async (
  commentData: TCommentCreate,
  jwt: string,
) => {
  if (!commentData.content) {
    throw new Error('Comment content is required')
  }

  if (!commentData.articleId) {
    throw new Error('Article reference is required')
  }

  const requestData = {
    data: {
      content: commentData.content,
      articleId: commentData.articleId,
      // user will be set by middleware from authenticated user
    },
  }

  // Use custom route for creating comments
  const response = await sdk.fetch('comments/custom/create-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(requestData),
  })

  return response.json() as Promise<TCommentSingleResponse>
}

// Update a comment
const updateCommentInternal = async (
  commentDocumentId: string,
  commentData: TCommentUpdate,
  jwt: string,
) => {
  const authenticatedComments = getAuthenticatedCollection('comments', jwt)
  return authenticatedComments.update(commentDocumentId, {
    content: commentData.content,
  }) as Promise<TCommentSingleResponse>
}

// Delete a comment
const deleteCommentInternal = async (
  commentDocumentId: string,
  jwt: string,
): Promise<TCommentSingleResponse> => {
  const authenticatedComments = getAuthenticatedCollection('comments', jwt)
  await authenticatedComments.delete(commentDocumentId)

  // Return a success response since SDK delete returns void
  return {
    data: {
      id: 0,
      documentId: commentDocumentId,
      content: '',
      articleId: '',
      createdAt: '',
      updatedAt: '',
    },
    meta: {},
  }
}

// Server function to get comments for an article
export const getCommentsForArticle = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (data: {
      articleDocumentId: string
      page?: number
      pageSize?: number
      searchQuery?: string
    }) => data,
  )
  .handler(async ({ data }): Promise<TCommentResponse> => {
    const response = await getCommentsForArticleInternal(
      data.articleDocumentId,
      data.page,
      data.pageSize,
      data.searchQuery,
    )
    return response
  })

// Server function to create a comment
export const createComment = createServerFn({
  method: 'POST',
})
  .inputValidator((data: TCommentCreate) => data)
  .handler(
    async ({
      data: commentData,
    }): Promise<TCommentSingleResponse | { error: string }> => {
      const session = await useAppSession()

      if (!session.data.jwt || !session.data.userId) {
        return { error: 'Authentication required' }
      }

      try {
        const response = await createCommentInternal(
          commentData,
          session.data.jwt,
        )
        return response
      } catch (error) {
        console.error('Error creating comment:', error)
        return {
          error:
            error instanceof Error ? error.message : 'Failed to create comment',
        }
      }
    },
  )

// Server function to update a comment
export const updateComment = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { commentDocumentId: string; commentData: TCommentUpdate }) => data,
  )
  .handler(
    async ({ data }): Promise<TCommentSingleResponse | { error: string }> => {
      const session = await useAppSession()

      if (!session.data.jwt || !session.data.userId) {
        return { error: 'Authentication required' }
      }

      try {
        const response = await updateCommentInternal(
          data.commentDocumentId,
          data.commentData,
          session.data.jwt,
        )
        return response
      } catch (error) {
        console.error('Error updating comment:', error)
        return { error: 'Failed to update comment' }
      }
    },
  )

// Server function to delete a comment
export const deleteComment = createServerFn({
  method: 'POST',
})
  .inputValidator((commentDocumentId: string) => commentDocumentId)
  .handler(
    async ({
      data: commentDocumentId,
    }): Promise<TCommentSingleResponse | { error: string }> => {
      const session = await useAppSession()

      if (!session.data.jwt || !session.data.userId) {
        return { error: 'Authentication required' }
      }

      try {
        const response = await deleteCommentInternal(
          commentDocumentId,
          session.data.jwt,
        )
        return response
      } catch (error) {
        console.error('Error deleting comment:', error)
        return { error: 'Failed to delete comment' }
      }
    },
  )
