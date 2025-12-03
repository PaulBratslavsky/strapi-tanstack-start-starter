import { ArticleDetail } from './article-detail';
import { ArticleContent } from './article-content';
import { ArticleBlocks } from './article-blocks';
import { RelatedArticles } from './related-articles';
import type { TAuthor, TImage, TRelatedArticle } from '../../../types';
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
  relatedArticles?: Array<TRelatedArticle>;
}

export function Article(props: IArticle) {
  const { title, description, featuredImage, content, author, blocks, publishedAt, contentTags, relatedArticles } = props;

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
      <RelatedArticles articles={relatedArticles} />
      <ArticleBlocks blocks={blocks} />
    </>
  );
}

export { ArticleBlocks };
