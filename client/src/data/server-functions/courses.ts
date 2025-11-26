import { createServerFn } from '@tanstack/react-start'
import type { TCourse, TLesson, TStrapiResponseCollection } from '@/types'
import { sdk } from '@/data/strapi-sdk'

const PAGE_SIZE = 3

const courses = sdk.collection('strapi-plugin-lms/courses')

const getCourses = async (
  queryString?: string,
  page?: number,
  tag?: string,
) => {
  const filterConditions: Array<Record<string, unknown>> = []

  if (queryString) {
    filterConditions.push({
      $or: [
        { title: { $containsi: queryString } },
        { content: { $containsi: queryString } },
      ],
    })
  }

  if (tag) {
    filterConditions.push({
      contentTags: {
        title: { $containsi: tag },
      },
    })
  }

  const filters =
    filterConditions.length === 0
      ? undefined
      : filterConditions.length === 1
        ? filterConditions[0]
        : { $and: filterConditions }

  return courses.find({
    sort: ['createdAt:desc'],
    pagination: {
      page: page || 1,
      pageSize: PAGE_SIZE,
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"]
      },
    },
    filters,
  }) as Promise<TStrapiResponseCollection<TCourse>>
}

const getCoursesBySlug = async (slug: string) =>
  courses.find({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      image: {
        fields: ['url', 'alternativeText'],
      },
      lessons: {
        fields: ['title', 'description', 'slug', 'videoId', 'videoUrl', 'videoTimecode'],
      },
    },
  }) as Promise<TStrapiResponseCollection<TCourse>>

export const getCoursesData = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (input?: { query?: string; page?: number; tag?: string }) => input,
  )
  .handler(async ({ data }): Promise<TStrapiResponseCollection<TCourse>> => {
    const response = await getCourses(data?.query, data?.page, data?.tag)
    return response
  })

export const getCoursesDataBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<TStrapiResponseCollection<TCourse>> => {
    const response = await getCoursesBySlug(slug)
    return response
  })

const lessons = sdk.collection('strapi-plugin-lms/lessons')

const getLessonBySlug = async (slug: string) =>
  lessons.find({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      course: {
        fields: ['title', 'slug'],
      },
    },
  }) as Promise<TStrapiResponseCollection<TLesson>>

export const getLessonDataBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<TStrapiResponseCollection<TLesson>> => {
    const response = await getLessonBySlug(slug)
    return response
  })
