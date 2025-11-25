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
}

export function Article(props: IArticle) {
  const { title, description, featuredImage, content, author, blocks } = props;

  return (
    <>
      <ArticleDetail
        title={title}
        description={description}
        featuredImage={featuredImage}
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
