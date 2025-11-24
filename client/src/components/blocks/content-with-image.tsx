import { Link } from '@tanstack/react-router'
import type { TImage, TLink } from '@/types'
import { Button } from '@/components/ui/button'
import { MarkdownContent } from '@/components/custom/markdown-content'
import { cn } from '@/lib/utils'
import { StrapiImage } from '@/components/custom/strapi-image'
import { Card } from '@/components/ui/card'

export interface IContentWithImage {
  __component: 'blocks.content-with-image'
  id: number
  reversed: boolean
  heading: string
  content: string
  link: TLink | undefined
  image: TImage
}

const styles = {
  section: 'block-section-sm',
  container: 'block-container block-card-padding block-bg-secondary',
  wrapper: 'grid grid-cols-1 items-center block-gap-lg lg:grid-cols-2',
  reversed: 'lg:[&>*:first-child]:order-2',
  heading: 'mb-6 text-4xl font-bold text-foreground lg:text-5xl font-heading',
  content: 'prose prose-lg mb-8 text-muted-foreground',
  paragraph: 'mb-4',
  image: 'rounded-base shadow-shadow border-2 border-border',
}

const markdownStyles = {
  richText: 'prose prose-lg mb-8 text-foreground',
  h1: 'text-3xl lg:text-4xl font-bold mb-5 text-foreground font-heading',
  h2: 'text-2xl lg:text-3xl font-bold mb-4 text-foreground font-heading',
  h3: 'text-xl lg:text-2xl font-bold mb-3 text-foreground font-heading',
  p: 'mb-5 leading-relaxed text-lg lg:text-xl',
  a: 'text-main hover:text-main/80 underline font-semibold transition-colors',
  ul: 'list-disc pl-8 mb-5 space-y-3 text-lg lg:text-xl',
  ol: 'list-decimal pl-8 mb-5 space-y-3 text-lg lg:text-xl',
  li: 'leading-relaxed',
  blockquote:
    'border-l-4 border-main pl-6 italic text-muted-foreground mb-5 text-lg lg:text-xl py-2',
  codeBlock: 'block bg-secondary-background border-2 border-border p-4 rounded-base text-base overflow-x-auto font-mono',
  codeInline: 'bg-secondary-background border border-border px-2 py-1 rounded-base text-base font-mono',
  pre: 'bg-secondary-background border-2 border-border p-4 rounded-base overflow-x-auto mb-5',
  table: 'w-full border-collapse border-2 border-border mb-5 text-lg',
  th: 'border-2 border-border p-3 bg-secondary-background font-bold text-left',
  td: 'border border-border p-3',
  img: 'max-w-full h-auto rounded-base border-2 border-border shadow-shadow mb-5',
  hr: 'border-2 border-border my-10',
}

export function ContentWithImage(props: Readonly<IContentWithImage>) {
  const { reversed, heading, content, link, image } = props
  const isExternal = Boolean(link?.isExternal)
  const buttonVariant = link?.type === 'PRIMARY' ? 'default' : 'neutral'
  const alt = image.alternativeText || heading || 'Content image'

  return (
    <section
      aria-labelledby="content-with-image-title"
      className={styles.section}
    >
      <Card className={styles.container}>
        <div className={cn(styles.wrapper, reversed && styles.reversed)}>
          <div>
            <h2 className={styles.heading}>{heading}</h2>

            <MarkdownContent content={content} styles={markdownStyles} />

            {link?.href && link.label && (
              <Button variant={buttonVariant} size="lg" asChild>
                <Link
                  to={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </Link>
              </Button>
            )}
          </div>

          <StrapiImage src={image.url} alt={alt} className={styles.image} />
        </div>
      </Card>
    </section>
  )
}
