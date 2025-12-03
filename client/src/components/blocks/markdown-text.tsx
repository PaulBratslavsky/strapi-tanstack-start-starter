import { MarkdownContentLazy } from "@/components/custom/markdown-content-lazy";

export interface IMarkdownText {
  __component: "blocks.markdown";
  id: number;
  content: string;
}

const markdownStyles = {
  richText: "space-y-6",
  h1: "text-4xl lg:text-5xl font-bold mb-5",
  h2: "text-3xl lg:text-4xl font-bold mb-4",
  h3: "text-2xl lg:text-3xl font-bold mb-3",
  p: "text-lg leading-relaxed border-l-4 border-black pl-4",
  a: "text-primary hover:text-primary/80 underline font-semibold transition-colors",
  ul: "list-disc pl-8 space-y-3 text-lg",
  ol: "list-decimal pl-8 space-y-3 text-lg",
  li: "leading-relaxed",
  blockquote: "border-l-4 border-primary pl-6 italic text-muted-foreground text-lg py-2",
  codeBlock: "block bg-muted border-2 border-border p-4 text-base overflow-x-auto font-mono",
  codeInline: "bg-muted border border-border px-2 py-1 text-base font-mono",
  pre: "bg-muted border-2 border-border p-4 overflow-x-auto",
  table: "w-full border-collapse border-2 border-border text-lg",
  th: "border-2 border-border p-3 bg-muted font-bold text-left",
  td: "border border-border p-3",
  img: "max-w-full h-auto border-2 border-border shadow mb-5",
  hr: "border-2 border-border my-10",
};

export function MarkdownText(props: Readonly<IMarkdownText>) {
  return (
    <section className="py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <MarkdownContentLazy content={props.content} styles={markdownStyles} />
      </div>
    </section>
  );
}
