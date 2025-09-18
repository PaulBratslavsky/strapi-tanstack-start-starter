import { Hero } from './hero'
import { SectionHeading } from './section-heading'
import { CardGrid } from './card-grid'
import { ContentWithImage } from './content-with-image'
import { MarkdownText } from './markdown-text'
import { PersonCard } from './person-card'
import { FeaturedArticles } from './featured-articles'

import type { IMarkdownText } from './markdown-text'
import type { IPersonCard } from './person-card'
import type { IContentWithImage } from './content-with-image'
import type { ISectionHeading } from './section-heading'
import type { ICardGrid } from './card-grid'
import type { IHero } from './hero'
import type { IFeaturedArticles } from './featured-articles'

export type Block =
  | IHero
  | ISectionHeading
  | ICardGrid
  | IContentWithImage
  | IMarkdownText
  | IPersonCard
  | IFeaturedArticles

interface BlockRendererProps {
  blocks: Array<Block>
}

export function BlockRenderer({ blocks }: Readonly<BlockRendererProps>) {
  const renderBlock = (block: Block) => {
    switch (block.__component) {
      case 'blocks.hero':
        return <Hero key={block.id} {...block} />
      case 'blocks.section-heading':
        return <SectionHeading key={block.id} {...block} />
      case 'blocks.card-grid':
        return <CardGrid key={block.id} {...block} />
      case 'blocks.content-with-image':
        return <ContentWithImage key={block.id} {...block} />
      case 'blocks.markdown':
        return <MarkdownText key={block.id} {...block} />
      case 'blocks.person-card':
        return <PersonCard key={block.id} {...block} />
      case 'blocks.featured-articles':
        return <FeaturedArticles key={block.id} {...block} />
      default:
        return null
    }
  }

  return <div>{blocks.map((block) => renderBlock(block))}</div>
}
