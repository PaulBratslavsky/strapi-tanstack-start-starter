import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearch } from '@tanstack/react-router'
import { strapiApi } from '@/data/server-functions'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TagsProps {
  className?: string
}

export function Tags({ className }: TagsProps) {
  const search = useSearch({ strict: false })
  const router = useRouter()
  const currentTag = (search as any)?.tag as string | undefined

  const { data, isLoading, error } = useQuery({
    queryKey: ['tags'],
    queryFn: () => strapiApi.tags.getTagsData(),
  })

  const handleTagClick = (tagTitle: string | null) => {
    router.navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        page: 1,
        tag: tagTitle || undefined,
      }),
      replace: true,
    })
  }

  if (isLoading) {
    return <div className="text-sm text-foreground/60">Loading tags...</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">Failed to load tags</div>
  }

  const tags = data?.data ?? []

  if (tags.length === 0) {
    return null
  }

  const isAllActive = !currentTag

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Badge
        asChild
        variant={isAllActive ? 'default' : 'neutral'}
        className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1 text-sm"
      >
        <button type="button" onClick={() => handleTagClick(null)}>
          All
        </button>
      </Badge>
      {tags.map((tag) => {
        const isActive = currentTag === tag.title
        return (
          <Badge
            asChild
            key={tag.documentId}
            variant={isActive ? 'default' : 'neutral'}
            className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1 text-sm"
          >
            <button type="button" onClick={() => handleTagClick(tag.title)}>
              {tag.title}
            </button>
          </Badge>
        )
      })}
    </div>
  )
}
