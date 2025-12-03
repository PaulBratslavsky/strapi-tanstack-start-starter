import { Hero } from './hero'
import { SectionHeading } from './section-heading'
import { CardGrid } from './card-grid'
import { ContentWithImage } from './content-with-image'
import { MarkdownText } from './markdown-text'
import { PersonCard } from './person-card'
import { FeaturedArticles } from './featured-articles'
import { Faqs } from './faqs'

import type { IMarkdownText } from './markdown-text'
import type { IPersonCard } from './person-card'
import type { IContentWithImage } from './content-with-image'
import type { ISectionHeading } from './section-heading'
import type { IHero } from './hero'
import type { IFeaturedArticles } from './featured-articles'
import type { IFaqs } from './faqs'
import type { ICardGrid } from './card-grid'

export type Block =
  | IHero
  | ISectionHeading
  | ICardGrid
  | IContentWithImage
  | IMarkdownText
  | IPersonCard
  | IFeaturedArticles
  | IFaqs

interface BlockRendererProps {
  blocks: Array<Block>
}

export function BlockRenderer({ blocks }: Readonly<BlockRendererProps>) {
  const renderBlock = (block: Block) => {
    switch (block.__component) {
      case 'blocks.hero':
        return <Hero {...block} />
      case 'blocks.section-heading':
        return <SectionHeading {...block} />
      case 'blocks.content-with-image':
        return <ContentWithImage {...block} />
      case 'blocks.markdown':
        return <MarkdownText {...block} />
      case 'blocks.person-card':
        return <PersonCard {...block} />
      case 'blocks.featured-articles':
        return <FeaturedArticles {...block} />
      case 'blocks.faqs':
        return <Faqs {...block} />
      case 'blocks.card-grid':
        return <CardGrid {...block} />
      default:
        return null
    }
  }

  return <div>{blocks.map((block, index) => <div key={`${block.__component}-${block.id}-${index}`}>{renderBlock(block)}</div>)}</div>
}
