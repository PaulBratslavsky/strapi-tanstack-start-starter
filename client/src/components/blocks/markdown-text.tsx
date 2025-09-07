import { MarkdownContent } from "../custom/markdown-content";

export interface IMarkdownText {
  __component: "blocks.markdown";
  id: number;
  content: string;
}

const markdownStyles = {
  richText:
    "rich-text py-6 dark:bg-black dark:text-gray-50 prose prose-lg max-w-none text-gray-700",
  h1: "text-3xl font-bold mb-4 text-gray-900 dark:text-white",
  h2: "text-2xl font-bold mb-3 text-gray-900 dark:text-white",
  h3: "text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100",
  p: "mb-4 leading-relaxed",
  a: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline",
  ul: "list-disc pl-6 mb-4 space-y-2",
  ol: "list-decimal pl-6 mb-4 space-y-2",
  li: "leading-relaxed",
  blockquote:
    "border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4",
  codeBlock:
    "block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto",
  codeInline: "bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm",
  pre: "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4",
  table:
    "w-full border-collapse border border-gray-300 dark:border-gray-600 mb-4",
  th: "border border-gray-300 dark:border-gray-600 p-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left",
  td: "border border-gray-300 dark:border-gray-600 p-2",
  img: "max-w-full h-auto rounded-lg mb-4",
  hr: "border-gray-300 dark:border-gray-600 my-8",
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