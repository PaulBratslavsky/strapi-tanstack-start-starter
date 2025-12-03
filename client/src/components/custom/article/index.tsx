import { ArticleDetail } from './article-detail';
import { ArticleContent } from './article-content';
import { ArticleBlocks } from './article-blocks';
import type { TAuthor, TImage } from '../../../types';
import type { Block } from '@/components/blocks/block-renderer';

export interface IArticle {
  documentId: string;
  createdAt: string;
  updatedAt: string;
  title?: string;
  description?: string;
  publishedAt?: string;
  slug?: string;
  author?: TAuthor;
  featuredImage?: TImage;
  content?: string;
  blocks?: Array<Block>;
  contentTags?: Array<{
    id: number;
    documentId: string;
    title: string;
  }>;
}

export function Article(props: IArticle) {
  const { title, description, featuredImage, content, author, blocks, publishedAt, contentTags } = props;

  return (
    <>
      <ArticleDetail
        title={title}
        description={description}
        featuredImage={featuredImage}
        author={author}
        publishedAt={publishedAt}
        contentTags={contentTags}
      />
      <ArticleContent
        content={content}
        author={author}
      />
      <ArticleBlocks blocks={blocks} />
    </>
  );
}

export { ArticleBlocks };
