import { getStrapiMedia } from '../../lib/utils'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import type { TImage } from '../../types'

export interface IPersonCard {
  __component: 'blocks.person-card'
  id: number
  text: string
  personName: string
  personJob: string
  image: TImage
}

const styles = {
  section: 'py-16 bg-muted/50',
  container: 'container mx-auto px-4',
  wrapper: 'max-w-4xl mx-auto text-center',
  card: 'p-8',
  cardContent: 'pt-6',
  avatar: 'w-24 h-24 mx-auto mb-6',
  quote: 'text-xl text-muted-foreground mb-6 italic leading-relaxed',
  name: 'text-lg font-semibold text-foreground',
  job: 'text-primary font-medium',
}

export function PersonCard(props: Readonly<IPersonCard>) {
  const { text, personName, personJob, image } = props

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Avatar className={styles.avatar}>
                <AvatarImage
                  src={getStrapiMedia(image.url)}
                  alt={image.alternativeText || personName}
                />
                <AvatarFallback>
                  {personName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <blockquote className={styles.quote}>"{text}"</blockquote>

              <div>
                <h3 className={styles.name}>{personName}</h3>
                <p className={styles.job}>{personJob}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
