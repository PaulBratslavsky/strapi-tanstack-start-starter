import { ArticleDetail } from './article-detail';
import { ArticleContent } from './article-content';
import type { TAuthor, TImage } from '../../../types';

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
}

export function Article(props: IArticle) {
  const { title, description, featuredImage, content, author } = props;

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
    </>
  );
}
