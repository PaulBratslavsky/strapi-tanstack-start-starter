import { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MarkdownContent = lazy(() =>
  import('./markdown-content').then((mod) => ({ default: mod.MarkdownContent }))
);

interface MarkdownStyles {
  richText: string;
  h1: string;
  h2: string;
  h3: string;
  p: string;
  a: string;
  ul: string;
  ol: string;
  li: string;
  blockquote: string;
  codeBlock: string;
  codeInline: string;
  pre: string;
  table: string;
  th: string;
  td: string;
  img: string;
  hr: string;
}

interface MarkdownContentLazyProps {
  content: string | undefined;
  styles: MarkdownStyles;
}

function MarkdownSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <Skeleton className="h-8 w-2/3" />
      {/* Paragraph skeletons */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      {/* Subheading skeleton */}
      <Skeleton className="h-6 w-1/2" />
      {/* More paragraph skeletons */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      {/* Code block skeleton */}
      <Skeleton className="h-32 w-full" />
      {/* Final paragraph skeletons */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function MarkdownContentLazy({ content, styles }: Readonly<MarkdownContentLazyProps>) {
  if (!content) return null;

  return (
    <Suspense fallback={<MarkdownSkeleton />}>
      <MarkdownContent content={content} styles={styles} />
    </Suspense>
  );
}
