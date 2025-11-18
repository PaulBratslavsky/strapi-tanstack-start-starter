import { useDebouncedCallback } from 'use-debounce'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CommentSearchProps {
  onSearch: (term: string) => void
  className?: string
  placeholder?: string
}

export function CommentSearch({
  onSearch,
  className,
  placeholder = 'Search comments...',
}: Readonly<CommentSearchProps>) {
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch(term)
  }, 300)

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleSearch(e.target.value)
        }
        className="pl-10"
      />
    </div>
  )
}
