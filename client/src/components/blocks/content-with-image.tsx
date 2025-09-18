import { Link } from '@tanstack/react-router'
import { StrapiImage } from '../custom/strapi-image'
import { Button } from '../ui/button'
import { MarkdownContent } from '../custom/markdown-content'
import { cn } from '../../lib/utils'
import type { TImage, TLink } from '../../types'

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
  section: 'py-16',
  container: 'container mx-auto px-4',
  wrapper: 'grid grid-cols-1 items-center gap-12 lg:grid-cols-2',
  reversed: 'lg:[&>*:first-child]:order-2',
  heading: 'mb-6 text-3xl font-bold text-foreground lg:text-4xl',
  content: 'prose prose-lg mb-8 text-muted-foreground',
  paragraph: 'mb-4',
  image: 'rounded-lg shadow-lg',
}

const markdownStyles = {
  richText: 'prose prose-lg mb-8 text-muted-foreground',
  h1: 'text-2xl font-bold mb-4 text-foreground',
  h2: 'text-xl font-bold mb-3 text-foreground',
  h3: 'text-lg font-semibold mb-2 text-foreground',
  p: 'mb-4 leading-relaxed',
  a: 'text-primary hover:text-primary/80 underline',
  ul: 'list-disc pl-6 mb-4 space-y-2',
  ol: 'list-decimal pl-6 mb-4 space-y-2',
  li: 'leading-relaxed',
  blockquote:
    'border-l-4 border-primary pl-4 italic text-muted-foreground mb-4',
  codeBlock: 'block bg-muted p-4 rounded-lg text-sm overflow-x-auto',
  codeInline: 'bg-muted px-2 py-1 rounded text-sm',
  pre: 'bg-muted p-4 rounded-lg overflow-x-auto mb-4',
  table: 'w-full border-collapse border border-border mb-4',
  th: 'border border-border p-2 bg-muted font-semibold text-left',
  td: 'border border-border p-2',
  img: 'max-w-full h-auto rounded-lg mb-4',
  hr: 'border-border my-8',
}

export function ContentWithImage(props: Readonly<IContentWithImage>) {
  const { reversed, heading, content, link, image } = props
  const isExternal = Boolean(link?.isExternal)
  const buttonVariant = link?.type === 'PRIMARY' ? 'default' : 'outline'
  const alt = image.alternativeText || heading || 'Content image'

  return (
    <section
      aria-labelledby="content-with-image-title"
      className={styles.section}
    >
      <div className={styles.container}>
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
      </div>
    </section>
  )
}
