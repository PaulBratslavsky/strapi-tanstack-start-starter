import type { TCard, TImage } from "@/types";
import { Text } from "@/components/retroui/Text";
import { StrapiImage } from "@/components/custom/strapi-image";
import { FallbackIcon } from "@/components/custom/fallback-icon";

export type TCardGridItem = TCard & {
  icon?: TImage;
};

export interface ICardGrid {
  __component: "blocks.card-grid";
  id: number;
  subHeading?: string;
  heading?: string;
  cards: Array<TCardGridItem>;
}

const cardVariants = [
  "bg-[#C4A1FF]", // Purple
  "bg-[#E7F193]", // Lime
  "bg-[#C4FF83]", // Green
  "bg-[#FFB3BA]", // Coral Pink
  "bg-[#A1D4FF]", // Sky Blue
  "bg-[#FFDAA1]", // Peach
] as const;

function getCardVariant(index: number) {
  return cardVariants[index % cardVariants.length];
}

export function CardGrid(props: Readonly<ICardGrid>) {
  const { subHeading, heading, cards } = props;

  return (
    <section className="bg-[#F9F5F2] py-20">
      {/* Section Header */}
      {(subHeading || heading) && (
        <div className="w-full container max-w-6xl px-4 xl:px-0 mx-auto text-start mb-8">
          {subHeading && (
            <Text className="mb-2 text-xl">
              {subHeading}
            </Text>
          )}
          {heading && (
            <Text as="h2">
              {heading}
            </Text>
          )}
        </div>
      )}

      {/* Cards Row */}
      <div className="w-full border-y-3">
        <div className="w-full container max-w-6xl px-4 xl:px-0 mx-auto overflow-x-auto">
          <div className="flex w-full border-x-3 border-black">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`group flex-1 min-w-0 p-6 xl:p-8 text-start transition-all duration-300 hover:bg-white/50 ${
                  index > 0 ? "border-l-3" : ""
                } border-black`}
              >
                <div
                  className={`w-12 h-12 lg:w-20 lg:h-20 p-2 lg:p-4 rounded-full border-2 shadow group-hover:shadow-none duration-300 transition-all flex items-center justify-center mb-6 lg:mb-8 ${getCardVariant(index)}`}
                >
                  {card.icon ? (
                    <StrapiImage
                      className="w-full h-full"
                      src={card.icon.url}
                      alt={card.icon.alternativeText || card.heading}
                    />
                  ) : (
                    <FallbackIcon index={index} />
                  )}
                </div>

                <Text
                  as="h3"
                  className="mb-2 transition-colors leading-tight"
                >
                  {card.heading}
                </Text>
                <Text className="text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
                  {card.text}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
