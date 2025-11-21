import { Suspense, lazy } from 'react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

// Lazy load the mermaid component to avoid SSR issues
const LazyMermaid = lazy(() =>
  import('@lightenna/react-mermaid-diagram').then((mod) => ({
    default: ({ chart, className }: MermaidDiagramProps) => (
      <mod.MermaidDiagram className={className} theme="default">
        {chart}
      </mod.MermaidDiagram>
    ),
  }))
);

// Fallback component shown during loading
function MermaidDiagramFallback({ chart, className }: MermaidDiagramProps) {
  return (
    <pre className={`my-4 p-4 bg-muted rounded border border-border ${className}`}>
      <code className="text-sm">{chart}</code>
    </pre>
  );
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  return (
    <Suspense fallback={<MermaidDiagramFallback chart={chart} className={className} />}>
      <LazyMermaid chart={chart} className={className} />
    </Suspense>
  );
}
