import type { TImage } from '@/types'
import { Text } from '@/components/retroui/Text'
import { StrapiImage } from '@/components/custom/strapi-image'

export interface IPersonCard {
  __component: 'blocks.person-card'
  id: number
  text: string
  personName: string
  personJob: string
  image: TImage
}

export function PersonCard(props: Readonly<IPersonCard>) {
  const { text, personName, personJob, image } = props
  const alt = image.alternativeText || personName || 'Person image'

  return (
    <section className="bg-white py-20">
      <div className="w-full border-y-2 bg-[#F9F5F2] py-12 xl:py-16">
        <div className="max-w-6xl container px-4 mx-auto w-full flex flex-col md:flex-row gap-12 xl:gap-28 justify-between items-center">
          {/* Image Section */}
          <div className="flex flex-col w-full md:w-2/5">
            <StrapiImage
              src={image.url}
              alt={alt}
              className="w-full h-auto px-4 md:px-0"
            />
          </div>

          {/* Content Section */}
          <div className="flex flex-col items-start md:w-3/5 justify-center">

            <Text as="h2" className="lg:text-6xl  mb-4 md:mb-6">
              {personName}
            </Text>

            <div className="space-y-2 mb-4 md:mb-6">
              <Text>{text}</Text>
            </div>

            <div className="bg-[#C4A1FF] text-primary-foreground px-3 py-1.5 font-medium shadow-md border-2">
              <Text className="leading-relaxed">{personJob}</Text>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
