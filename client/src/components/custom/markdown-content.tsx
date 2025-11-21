import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useEffect, useState } from 'react';
import { MermaidDiagram } from "./mermaid-diagram";

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

interface MarkdownContentProps {
  content: string | undefined;
  styles: MarkdownStyles;
}

export function MarkdownContent({ content, styles }: Readonly<MarkdownContentProps>) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (!content) return null;

  return (
    <div className={styles.richText}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => <h1 className={styles.h1} {...props} />,
          h2: ({ ...props }) => <h2 className={styles.h2} {...props} />,
          h3: ({ ...props }) => <h3 className={styles.h3} {...props} />,
          p: ({ ...props }) => <p className={styles.p} {...props} />,
          a: ({ ...props }) => <a className={styles.a} {...props} />,
          ul: ({ ...props }) => <ul className={styles.ul} {...props} />,
          ol: ({ ...props }) => <ol className={styles.ol} {...props} />,
          li: ({ ...props }) => <li className={styles.li} {...props} />,
          blockquote: ({ ...props }) => <blockquote className={styles.blockquote} {...props} />,
          code: ({ className, children, ...props }) => {
            // Check if this is a code block (has language class)
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            // Handle mermaid diagrams
            if (language === 'mermaid') {
              return (
                <MermaidDiagram
                  chart={String(children).trim()}
                  className="my-4"
                />
              );
            }

            // Handle code blocks with syntax highlighting
            if (language) {
              return (
                <SyntaxHighlighter
                  language={language}
                  style={isDark ? vscDarkPlus : vs}
                  customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                  }}
                  showLineNumbers
                  wrapLines
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }

            // Handle inline code
            return (
              <code className={styles.codeInline} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            // Pre is handled by SyntaxHighlighter, just return children
            return <>{children}</>;
          },
          table: ({ ...props }) => <table className={styles.table} {...props} />,
          th: ({ ...props }) => <th className={styles.th} {...props} />,
          td: ({ ...props }) => <td className={styles.td} {...props} />,
          img: ({ ...props }) => <img className={styles.img} {...props} />,
          hr: ({ ...props }) => <hr className={styles.hr} {...props} />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}