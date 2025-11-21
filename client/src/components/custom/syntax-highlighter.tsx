import { Suspense, lazy, useEffect, useState } from 'react';

interface SyntaxHighlighterProps {
  language: string;
  code: string;
  isDark: boolean;
  className?: string;
}

// Fallback component for SSR and loading
function SyntaxHighlighterFallback({ code, className }: SyntaxHighlighterProps) {
  return (
    <pre className={`${className} p-4 bg-muted rounded border border-border overflow-auto`}>
      <code className="text-sm">{code}</code>
    </pre>
  );
}

// Lazy load syntax highlighter to avoid SSR issues
const LazySyntaxHighlighter = lazy(() =>
  import('react-syntax-highlighter').then((mod) => ({
    default: ({ language, code, isDark, className }: SyntaxHighlighterProps) => {
      const [styles, setStyles] = useState<any>(null);

      useEffect(() => {
        import('react-syntax-highlighter/dist/esm/styles/prism').then((styleModule) => {
          setStyles(styleModule);
        });
      }, []);

      if (!styles) {
        return <SyntaxHighlighterFallback code={code} language={language} isDark={isDark} className={className} />;
      }

      return (
        <mod.Prism
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
        </mod.Prism>
      );
    },
  }))
);

export function SyntaxHighlighter(props: SyntaxHighlighterProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render the syntax highlighter on the client to avoid SSR issues
  if (!isClient) {
    return <SyntaxHighlighterFallback {...props} />;
  }

  return (
    <Suspense fallback={<SyntaxHighlighterFallback {...props} />}>
      <LazySyntaxHighlighter {...props} />
    </Suspense>
  );
}
