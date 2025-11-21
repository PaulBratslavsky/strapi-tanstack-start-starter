import { ClientOnly } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

interface SyntaxHighlighterProps {
  language: string;
  code: string;
  isDark: boolean;
  className?: string;
}

// Fallback component for SSR
function SyntaxHighlighterFallback({ code, className }: SyntaxHighlighterProps) {
  return (
    <pre className={className}>
      <code>{code}</code>
    </pre>
  );
}

// Client-side component that dynamically imports react-syntax-highlighter
function ClientSyntaxHighlighter({ language, code, isDark, className }: SyntaxHighlighterProps) {
  const [Component, setComponent] = useState<any>(null);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    // Dynamic imports only run on client
    Promise.all([
      import('react-syntax-highlighter'),
      import('react-syntax-highlighter/dist/esm/styles/prism')
    ]).then(([mod, styleModule]) => {
      setComponent(() => mod.Prism);
      setStyles(styleModule);
    });
  }, []);

  if (!Component || !styles) {
    return <SyntaxHighlighterFallback code={code} language={language} isDark={isDark} className={className} />;
  }

  return (
    <Component
      language={language}
      style={isDark ? styles.vscDarkPlus : styles.vs}
      customStyle={{
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1.5rem',
      }}
      showLineNumbers
      wrapLines
    >
      {code}
    </Component>
  );
}

export function SyntaxHighlighter(props: SyntaxHighlighterProps) {
  return (
    <ClientOnly fallback={<SyntaxHighlighterFallback {...props} />}>
      <ClientSyntaxHighlighter {...props} />
    </ClientOnly>
  );
}
