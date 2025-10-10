import { MarkdownContent } from "../custom/markdown-content";

export interface IMarkdownText {
  __component: "blocks.markdown";
  id: number;
  content: string;
}

const markdownStyles = {
  richText:
    "rich-text py-6 prose prose-lg max-w-none text-foreground",
  h1: "text-3xl font-bold mb-4 text-foreground",
  h2: "text-2xl font-bold mb-3 text-foreground",
  h3: "text-xl font-semibold mb-2 text-foreground",
  p: "mb-4 leading-relaxed text-foreground",
  a: "text-primary hover:opacity-80 underline",
  ul: "list-disc pl-6 mb-4 space-y-2",
  ol: "list-decimal pl-6 mb-4 space-y-2",
  li: "leading-relaxed",
  blockquote:
    "border-l-4 border-primary pl-4 italic text-muted-foreground mb-4",
  codeBlock:
    "block bg-muted p-4 rounded-lg text-sm overflow-x-auto text-foreground",
  codeInline: "bg-muted px-2 py-1 rounded text-sm text-foreground",
  pre: "bg-muted p-4 rounded-lg overflow-x-auto mb-4",
  table:
    "w-full border-collapse border border-border mb-4",
  th: "border border-border p-2 bg-muted font-semibold text-left text-foreground",
  td: "border border-border p-2 text-foreground",
  img: "max-w-full h-auto rounded-lg mb-4",
  hr: "border-border my-8",
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