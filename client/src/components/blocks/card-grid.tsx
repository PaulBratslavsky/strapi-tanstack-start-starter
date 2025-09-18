import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { TCard } from "../../types";

export interface ICardGrid {
  __component: "blocks.card-grid";
  id: number;
  cards: Array<TCard>;
}

const styles = {
  section: "py-16 bg-muted/50",
  container: "container mx-auto px-4",
  cardGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  cardContainer: "hover:shadow-lg transition-shadow",
  cardTitle: "text-xl",
  cardText: "text-muted-foreground leading-relaxed",
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