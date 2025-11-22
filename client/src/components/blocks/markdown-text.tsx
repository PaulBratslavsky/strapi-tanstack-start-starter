import { MarkdownContent } from "../custom/markdown-content";

export interface IMarkdownText {
  __component: "blocks.markdown";
  id: number;
  content: string;
}

const markdownStyles = {
  richText:
    "rich-text py-6 prose prose-lg max-w-none text-foreground",
  h1: "text-4xl lg:text-5xl font-bold mb-6 text-foreground font-heading",
  h2: "text-3xl lg:text-4xl font-bold mb-5 text-foreground font-heading",
  h3: "text-2xl lg:text-3xl font-bold mb-4 text-foreground font-heading",
  p: "mb-6 leading-relaxed text-foreground text-lg lg:text-xl",
  a: "text-main hover:text-main/80 underline font-semibold transition-colors",
  ul: "list-disc pl-8 mb-6 space-y-3 text-lg lg:text-xl",
  ol: "list-decimal pl-8 mb-6 space-y-3 text-lg lg:text-xl",
  li: "leading-relaxed",
  blockquote:
    "border-l-4 border-main pl-6 italic text-muted-foreground mb-6 text-lg lg:text-xl py-2",
  codeBlock:
    "block bg-secondary-background border-2 border-border p-4 rounded-base text-base overflow-x-auto text-foreground font-mono",
  codeInline: "bg-secondary-background border border-border px-2 py-1 rounded-base text-base text-foreground font-mono",
  pre: "bg-secondary-background border-2 border-border p-4 rounded-base overflow-x-auto mb-6",
  table:
    "w-full border-collapse border-2 border-border mb-6 text-lg",
  th: "border-2 border-border p-3 bg-secondary-background font-bold text-left text-foreground",
  td: "border border-border p-3 text-foreground",
  img: "max-w-full h-auto rounded-base border-2 border-border shadow-shadow mb-6",
  hr: "border-2 border-border my-12",
};

export function MarkdownText(props: Readonly<IMarkdownText>) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <MarkdownContent content={props.content} styles={markdownStyles} />
        </div>
      </div>
    </section>
  );
}