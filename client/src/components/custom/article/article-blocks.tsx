import type {Block} from '@/components/blocks/block-renderer';
import {  BlockRenderer } from '@/components/blocks/block-renderer'

interface ArticleBlocksProps {
  blocks?: Array<Block>
}

export function ArticleBlocks({ blocks }: ArticleBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return <BlockRenderer blocks={blocks} />
}
