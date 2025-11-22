import { ClientOnly } from '@tanstack/react-router'
import { MermaidDiagram as MermaidDiagramLib } from '@lightenna/react-mermaid-diagram'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

// Fallback component shown during SSR
function MermaidDiagramFallback({ chart, className }: MermaidDiagramProps) {
  return (
    <pre className={`my-4 p-4 bg-muted rounded border border-border ${className}`}>
      <code className="text-sm">{chart}</code>
    </pre>
  )
}

// Client-only mermaid component
function MermaidDiagramClient({ chart, className = '' }: MermaidDiagramProps) {
  return (
    <MermaidDiagramLib className={className} theme="default">
      {chart}
    </MermaidDiagramLib>
  )
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  return (
    <ClientOnly fallback={<MermaidDiagramFallback chart={chart} className={className} />}>
      <MermaidDiagramClient chart={chart} className={className} />
    </ClientOnly>
  )
}
