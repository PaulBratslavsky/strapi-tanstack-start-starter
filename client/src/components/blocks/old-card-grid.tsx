import type { TCard } from "@/types";
import { Card } from "@/components/retroui/Card";

export interface ICardGrid {
  __component: "blocks.card-grid";
  id: number;
  cards: Array<TCard>;
}

const cardVariants = [
  { bg: "bg-[#C4A1FF]", title: "text-black", description: "text-black/70" }, // Purple
  { bg: "bg-[#E7F193]", title: "text-black", description: "text-black/70" }, // Lime
  { bg: "bg-[#C4FF83]", title: "text-black", description: "text-black/70" }, // Green
  { bg: "bg-[#FFB3BA]", title: "text-black", description: "text-black/70" }, // Coral Pink
  { bg: "bg-[#A1D4FF]", title: "text-black", description: "text-black/70" }, // Sky Blue
  { bg: "bg-[#FFDAA1]", title: "text-black", description: "text-black/70" }, // Peach
] as const;

function getCardVariant(index: number) {
  return cardVariants[index % cardVariants.length];
}

const styles = {
  container: "mx-auto max-w-6xl py-16",
  cardGrid: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 block-gap-sm",
};

export function CardGrid(props: Readonly<ICardGrid>) {
  const { cards } = props;

  return (
    <section>
      <div className={styles.container}>
        <div className={styles.cardGrid}>
          {cards.map((card, index) => {
            const variant = getCardVariant(index);
            return (
              <Card key={card.id} className={`${variant.bg} border-4 duration-200`}>
                <Card.Header>
                  <Card.Title className={variant.title}>{card.heading}</Card.Title>
                  <Card.Description className={variant.description}>{card.text}</Card.Description>
                </Card.Header>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
