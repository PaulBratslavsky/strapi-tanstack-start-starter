import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

// Helper to fetch all slugs from Strapi for prerendering
async function getPrerenderPaths(): Promise<Array<string>> {
  const STRAPI_URL = process.env.VITE_STRAPI_URL || 'http://localhost:1337'
  const paths: Array<string> = [
    '/',           // Landing page
    '/articles',   // Articles index
    '/courses',    // Courses index
  ]

  try {
    // Fetch all article slugs
    const articlesRes = await fetch(
      `${STRAPI_URL}/api/articles?fields[0]=slug&pagination[pageSize]=100`
    )
    if (articlesRes.ok) {
      const articles = await articlesRes.json()
      articles.data?.forEach((article: { slug: string }) => {
        if (article.slug) {
          paths.push(`/articles/${article.slug}`)
        }
      })
    }

    // Fetch all course slugs
    const coursesRes = await fetch(
      `${STRAPI_URL}/api/strapi-plugin-lms/courses?fields[0]=slug&pagination[pageSize]=100`
    )
    if (coursesRes.ok) {
      const courses = await coursesRes.json()
      courses.data?.forEach((course: { slug: string }) => {
        if (course.slug) {
          paths.push(`/courses/${course.slug}`)
        }
      })
    }

    // Fetch all page slugs (dynamic pages like /about, /contact, etc.)
    const pagesRes = await fetch(
      `${STRAPI_URL}/api/pages?fields[0]=slug&pagination[pageSize]=100`
    )
    if (pagesRes.ok) {
      const pages = await pagesRes.json()
      pages.data?.forEach((page: { slug: string }) => {
        if (page.slug) {
          paths.push(`/${page.slug}`)
        }
      })
    }

    console.log(`[Prerender] Found ${paths.length} paths to prerender:`, paths)
  } catch (error) {
    console.warn('[Prerender] Failed to fetch paths from Strapi:', error)
    console.warn('[Prerender] Continuing with static paths only')
  }

  return paths
}

const config = defineConfig(async ({ mode }) => {
  const prerenderPaths = mode === 'production' ? await getPrerenderPaths() : []

  // Convert paths to pages config format
  const pages = prerenderPaths.map((path) => ({
    path,
    prerender: { enabled: true },
  }))

  return {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart({
        prerender: {
          enabled: mode === 'production',
          crawlLinks: true,
          autoStaticPathsDiscovery: true,
          // Exclude routes that return 404 or are not meant to be prerendered
          filter: ({ path }) => {
            const excludedPaths = [
              '/not-found',
              '/signin',
              '/signup',
              '/api/connect',  // OAuth routes
            ]
            return !excludedPaths.some((excluded) => path.startsWith(excluded))
          },
          // Don't fail build on errors, just log them
          failOnError: false,
        },
        pages,
      }),
      viteReact(),
      ...(mode === 'production' ? [netlify()] : []),
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    },
  }
})

export default config
