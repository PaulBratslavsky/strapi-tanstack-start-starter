import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export interface IFaqs {
  __component: "blocks.faqs";
  id: number;
  faq: Array<{
    id: number;
    heading: string;
    text: string;
  }>;
}

const styles = {
  section: "py-16 bg-white dark:bg-dark",
  container: "container mx-auto px-4 max-w-3xl",
  accordion: "w-full",
};

export function Faqs(props: Readonly<IFaqs>) {
  const { faq } = props;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Accordion type="single" collapsible className={styles.accordion}>
          {faq.map((item) => (
            <AccordionItem key={item.id} value={`item-${item.id}`} className={"mb-4"}>
              <AccordionTrigger>{item.heading}</AccordionTrigger>
              <AccordionContent>{item.text}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
