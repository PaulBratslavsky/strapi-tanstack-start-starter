import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { StrapiImage } from '../custom/strapi-image'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import type { TImage, TLink } from '../../types'

export interface IHero {
  __component: 'blocks.hero'
  id: number
  heading: string
  text: string
  links: Array<TLink>
  image: TImage
  badge?: string
}

const styles = {
  section: 'py-32',
  container: 'container mx-auto',
  grid: 'grid items-center gap-8 lg:grid-cols-2',
  content: 'flex flex-col items-center text-center lg:items-start lg:text-left',
  badge: 'mb-6',
  heading: 'my-6 text-pretty text-4xl font-bold lg:text-6xl',
  text: 'text-muted-foreground mb-8 max-w-xl lg:text-xl',
  buttonContainer:
    'flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start',
  primaryButton: 'w-full sm:w-auto',
  secondaryButton: 'w-full sm:w-auto',
  icon: 'ml-2 size-4',
  image: 'max-h-96 w-full rounded-md object-cover',
}

export function Hero(props: Readonly<IHero>) {
  const { heading, text, links, image, badge } = props

  // Separate primary and secondary buttons
  const primaryLink = links.find((link) => link.type === 'PRIMARY')
  const secondaryLink =
    links.find((link) => link.type === 'SECONDARY') ||
    links.find((link) => link.type !== 'PRIMARY')

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content}>
            {badge && (
              <Badge variant="outline" className={styles.badge}>
                {badge}
                <ArrowUpRight className={styles.icon} />
              </Badge>
            )}
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.text}>{text}</p>
            <div className={styles.buttonContainer}>
              {primaryLink && (
                <Button asChild className={styles.primaryButton} size="lg">
                  <Link
                    to={primaryLink.href}
                    target={primaryLink.isExternal ? '_blank' : undefined}
                    rel={
                      primaryLink.isExternal ? 'noopener noreferrer' : undefined
                    }
                  >
                    {primaryLink.label}
                  </Link>
                </Button>
              )}
              {secondaryLink && (
                <Button
                  asChild
                  variant="outline"
                  className={styles.secondaryButton}
                  size="lg"
                >
                  <Link
                    to={secondaryLink.href}
                    target={secondaryLink.isExternal ? '_blank' : undefined}
                    rel={
                      secondaryLink.isExternal
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  >
                    {secondaryLink.label}
                    <ArrowRight className={styles.icon} />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <StrapiImage
            src={image.url}
            alt={image.alternativeText || heading}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  )
}
