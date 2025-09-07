import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          code: ({ className, ...props }) => (
            className ? (
              <code className={styles.codeBlock} {...props} />
            ) : (
              <code className={styles.codeInline} {...props} />
            )
          ),
          pre: ({ ...props }) => <pre className={styles.pre} {...props} />,
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