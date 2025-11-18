import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { TCard } from "../../types";

export interface ICardGrid {
  __component: "blocks.card-grid";
  id: number;
  cards: Array<TCard>;
}

const styles = {
  section: "py-16 bg-white dark:bg-background",
  container: "container mx-auto px-4",
  cardGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  cardContainer: "hover:shadow-lg transition-shadow bg-main text-main-foreground",
  cardTitle: "text-xl",
  cardText: "text-main-foreground/80 leading-relaxed",
};

export function CardGrid(props: Readonly<ICardGrid>) {
  const { cards } = props;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.cardGrid}>
          {cards.map((card) => (
            <Card key={card.id} className={styles.cardContainer}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  {card.heading}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={styles.cardText}>{card.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}