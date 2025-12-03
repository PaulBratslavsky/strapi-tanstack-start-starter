import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/retroui/Button'
import { Text } from '@/components/retroui/Text'
import { cn } from '@/lib/utils'

interface CommentPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function CommentPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: Readonly<CommentPaginationProps>) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={cn(
          "border-2 border-black",
          !canGoPrevious && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      <Text className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </Text>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={cn(
          "border-2 border-black",
          !canGoNext && "opacity-50 cursor-not-allowed"
        )}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
