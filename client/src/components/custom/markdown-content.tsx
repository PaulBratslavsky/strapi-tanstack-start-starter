import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEffect, useMemo, useState } from 'react';
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

interface Reference {
  number: number;
  url: string;
  title?: string;
}

// Parse references from the bottom of the content
// Supports multiple formats:
// - [1](https://example.com) or [1](https://example.com "Title")
// - - [1](https://example.com) Title text (list format with description after)
function parseReferences(content: string): { mainContent: string; references: Map<number, Reference> } {
  const references = new Map<number, Reference>();

  const lines = content.split('\n');

  // Find "## Sources" or "## References" section
  let sourcesStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    if (line === '## sources' || line === '## references' || line === '---' && i > 0 && lines[i-1].trim().toLowerCase().includes('sources')) {
      sourcesStartIndex = i;
      break;
    }
  }

  // If we found a sources section, parse from there
  if (sourcesStartIndex !== -1) {
    const refLines = lines.slice(sourcesStartIndex);
    for (const line of refLines) {
      // Match formats like:
      // - [1](https://example.com) Title text
      // [1](https://example.com) Title text
      // - [1](https://example.com "Title")
      const match = /^[-*]?\s*\[(\d+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*(.*)$/.exec(line.trim());
      if (match) {
        const refNum = parseInt(match[1], 10);
        const url = match[2];
        // Title can come from either the quoted title or the text after the link
        const title = match[3] || match[4]?.trim() || undefined;
        references.set(refNum, {
          number: refNum,
          url,
          title,
        });
      }
    }

    // Remove sources section from main content
    const mainContent = lines.slice(0, sourcesStartIndex).join('\n').trimEnd();
    return { mainContent, references };
  }

  // Fallback: scan from the end for consecutive reference lines (original behavior)
  let refStartIndex = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line === '') continue; // Skip empty lines
    if (/^[-*]?\s*\[\d+\]\([^)]+\)/.test(line)) {
      refStartIndex = i;
    } else {
      break; // Stop when we hit non-reference content
    }
  }

  // Extract references
  const refLines = lines.slice(refStartIndex);
  for (const line of refLines) {
    const match = /^[-*]?\s*\[(\d+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*(.*)$/.exec(line.trim());
    if (match) {
      const refNum = parseInt(match[1], 10);
      const url = match[2];
      const title = match[3] || match[4]?.trim() || undefined;
      references.set(refNum, {
        number: refNum,
        url,
        title,
      });
    }
  }

  // Remove references section from main content
  const mainContent = lines.slice(0, refStartIndex).join('\n').trimEnd();

  return { mainContent, references };
}

// Convert inline citations [1], [2][3] to superscript links
function processCitations(content: string, references: Map<number, Reference>): string {
  // Match citation patterns like [1], [1][2], [1][2][3]
  // This regex finds individual [number] patterns
  return content.replace(/\[(\d+)\](?!\()/g, (match, num) => {
    const refNum = parseInt(num, 10);
    if (references.has(refNum)) {
      // Return a special marker that we'll handle in the component
      return `<cite-ref data-ref="${refNum}">[${refNum}]</cite-ref>`;
    }
    return match; // Keep original if no reference found
  });
}

export function MarkdownContent({ content, styles }: Readonly<MarkdownContentProps>) {
  const [isDark, setIsDark] = useState(false);

  // Parse and process content with references
  const { processedContent, references } = useMemo(() => {
    if (!content) return { processedContent: '', references: new Map<number, Reference>() };

    const parsed = parseReferences(content);
    const processed = processCitations(parsed.mainContent, parsed.references);

    return { processedContent: processed, references: parsed.references };
  }, [content]);

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

  // Sort references by number for display
  const sortedReferences = useMemo(() => {
    return Array.from(references.values()).sort((a, b) => a.number - b.number);
  }, [references]);

  // Get domain name from URL for display
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className={styles.richText}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
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
          code: ({ className, children, node, ...props }) => {
            // Check if this is a code block (inside pre tag) by checking parent or if it has newlines
            const isCodeBlock = node?.position && String(children).includes('\n');

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

            // Handle code blocks without language (ASCII art, plain text)
            if (isCodeBlock) {
              return (
                <pre className={styles.pre}>
                  <code className="whitespace-pre font-mono text-sm" {...props}>
                    {children}
                  </code>
                </pre>
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
            // Pre wrapper - children already handled by code component
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
          // Handle citation references (custom HTML element parsed by rehype-raw)
          ...({
            'cite-ref': ({ node, ...props }: { node?: { properties?: { dataRef?: string } }; [key: string]: unknown }) => {
              const refNum = parseInt(String(node?.properties?.dataRef ?? '0'), 10);
              const ref = references.get(refNum);
              if (!ref) return <span {...(props as React.HTMLAttributes<HTMLSpanElement>)} />;

              return (
                <a
                  href={`#ref-${refNum}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs align-super font-semibold no-underline hover:underline"
                  title={ref.title || getDomain(ref.url)}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(`ref-${refNum}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                >
                  [{refNum}]
                </a>
              );
            },
          } as Record<string, unknown>),
        }}
      >
        {processedContent}
      </Markdown>

      {/* References Section */}
      {sortedReferences.length > 0 && (
        <div className="mt-12 pt-8 border-t-2 border-dashed border-border">
          <h3 className={styles.h3}>References</h3>
          <ol className="list-none space-y-3 mt-4 text-sm">
            {sortedReferences.map((ref) => (
              <li
                key={ref.number}
                id={`ref-${ref.number}`}
                className="flex gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
              >
                <span className="font-bold text-blue-600 dark:text-blue-400 min-w-8">[{ref.number}]</span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.a} break-all`}
                >
                  {ref.title || getDomain(ref.url)}
                  <span className="text-muted-foreground ml-2 text-xs">
                    ({getDomain(ref.url)})
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}