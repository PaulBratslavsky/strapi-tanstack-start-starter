import { Suspense, lazy, useEffect, useState } from 'react';

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render the mermaid diagram on the client to avoid hydration mismatch
  if (!isClient) {
    return <MermaidDiagramFallback chart={chart} className={className} />;
  }

  return (
    <Suspense fallback={<MermaidDiagramFallback chart={chart} className={className} />}>
      <LazyMermaid chart={chart} className={className} />
    </Suspense>
  );
}
