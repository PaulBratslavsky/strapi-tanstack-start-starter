import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string>(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Initialize mermaid with configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      logLevel: 'error',
    });

    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Log the chart for debugging
        console.log('Rendering mermaid chart:', chart);

        // Render the mermaid diagram
        const { svg } = await mermaid.render(idRef.current, chart);

        // Insert the rendered SVG
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        console.error('Chart content:', chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-destructive text-sm p-4 border border-destructive rounded bg-destructive/10">
            <strong>Mermaid Diagram Error:</strong><br/>
            ${error instanceof Error ? error.message : 'Failed to render diagram'}<br/>
            <details class="mt-2">
              <summary class="cursor-pointer">Show diagram code</summary>
              <pre class="mt-2 text-xs overflow-auto">${chart}</pre>
            </details>
          </div>`;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className={`mermaid-container ${className}`}
    />
  );
}
