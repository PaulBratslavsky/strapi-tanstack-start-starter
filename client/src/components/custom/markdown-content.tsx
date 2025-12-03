import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { SyntaxHighlighter } from "./syntax-highlighter";
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
          h1: ({ children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h1 id={id} className={styles.h1} {...props}>{children}</h1>;
          },
          h2: ({ children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h2 id={id} className={styles.h2} {...props}>{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h3 id={id} className={styles.h3} {...props}>{children}</h3>;
          },
          p: ({ ...props }) => <p className={styles.p} {...props} />,
          a: ({ href, children, ...props }) => {
            // Check if this is a YouTube link with "youtube" text
            const isYouTubeLink = href && (
              href.includes('youtube.com') ||
              href.includes('youtu.be')
            );
            const hasYouTubeText = children &&
              String(children).toLowerCase().includes('youtube');

            if (isYouTubeLink && hasYouTubeText) {
              return (
                <div key={href} className="my-6 aspect-video max-w-full">
                  <ReactPlayer
                    src={href}
                    width="100%"
                    height="100%"
                    controls
                  />
                </div>
              );
            }

            // Handle hash links (table of contents)
            const isHashLink = href?.startsWith('#');
            if (isHashLink && href) {
              return (
                <a
                  href={href}
                  className={styles.a}
                  onClick={(e) => {
                    e.preventDefault();
                    const id = href.substring(1);
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      // Update URL hash without triggering navigation
                      window.history.pushState(null, '', href);
                    }
                  }}
                  {...props}
                >
                  {children}
                </a>
              );
            }

            return <a href={href} className={styles.a} {...props}>{children}</a>;
          },
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
                  code={String(children).replace(/\n$/, '')}
                  isDark={isDark}
                  className="my-4"
                />
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
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className={styles.table} {...props} />
            </div>
          ),
          thead: ({ ...props }) => <thead {...props} />,
          tbody: ({ ...props }) => <tbody {...props} />,
          tr: ({ ...props }) => <tr className="border-b border-border" {...props} />,
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