import { createFileRoute, notFound } from '@tanstack/react-router'
import { strapiApi } from '@/data/server-functions'
import { NotFound } from '@/components/custom/not-found'
import { CourseDetail } from '@/components/custom/course-detail'

export const Route = createFileRoute('/courses/$slug')({
  component: CourseDetailRoute,
  loader: async ({ params }) => {
    const courseResponse = await strapiApi.courses.getCoursesDataBySlug({
      data: params.slug,
    })

    if (!courseResponse.data.length) throw notFound()
    return {
      course: courseResponse.data[0],
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.course.title },
      { name: 'description', content: loaderData?.course?.description ?? undefined },
    ],
  }),
  notFoundComponent: () => {
    return <NotFound title="Course Not Found" message="Course not found" />
  },
})

function CourseDetailRoute() {
  const { course } = Route.useLoaderData()
  return <CourseDetail {...course} />
}
