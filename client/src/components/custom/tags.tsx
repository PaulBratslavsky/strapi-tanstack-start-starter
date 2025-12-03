import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearch } from '@tanstack/react-router'
import { strapiApi } from '@/data/server-functions'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/retroui/Badge'

const tagColors = [
  "bg-[#C4A1FF] text-black", // Purple
  "bg-[#E7F193] text-black", // Lime
  "bg-[#C4FF83] text-black", // Green
  "bg-[#FFB3BA] text-black", // Coral Pink
  "bg-[#A1D4FF] text-black", // Sky Blue
  "bg-[#FFDAA1] text-black", // Peach
] as const;

function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

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
        size="sm"
        className={cn(
          "cursor-pointer hover:opacity-80 transition-opacity border-2 border-black",
          isAllActive ? "bg-black text-white" : "bg-white text-black"
        )}
        onClick={() => handleTagClick(null)}
      >
        All
      </Badge>
      {tags.map((tag) => {
        const isActive = currentTag === tag.title
        return (
          <Badge
            key={tag.documentId}
            size="sm"
            className={cn(
              "cursor-pointer hover:opacity-80 transition-opacity border-2 border-black",
              isActive ? "ring-2 ring-black ring-offset-1" : "",
              getTagColor(tag.title)
            )}
            onClick={() => handleTagClick(tag.title)}
          >
            {tag.title}
          </Badge>
        )
      })}
    </div>
  )
}
