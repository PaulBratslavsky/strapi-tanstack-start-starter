import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  readonly chart: string;
  readonly className?: string;
}

// Fallback component shown during SSR and loading
function MermaidDiagramFallback({ chart, className }: MermaidDiagramProps) {
  return (
    <pre className={`my-4 p-4 bg-muted rounded border border-border ${className}`}>
      <code className="text-sm">{chart}</code>
    </pre>
  );
}

// Client-side mermaid renderer
function MermaidDiagramClient({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Initialize mermaid with configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      suppressErrorRendering: true,
    });

    // Generate unique ID for this diagram
    const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

    // Render the diagram
    const renderDiagram = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
        setError('');
      } catch (err) {
        // Silently handle errors - suppressErrorRendering prevents UI display
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return <MermaidDiagramFallback chart={chart} className={className} />;
  }

  if (!svg) {
    return <MermaidDiagramFallback chart={chart} className={className} />;
  }

  return (
    <div
      ref={containerRef}
      className={`my-4 flex justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// Lazy load the client component - only loads on client
const LazyMermaidClient = lazy(() =>
  Promise.resolve({ default: MermaidDiagramClient })
);

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  return (
    <Suspense fallback={<MermaidDiagramFallback chart={chart} className={className} />}>
      <LazyMermaidClient chart={chart} className={className} />
    </Suspense>
  );
}
