import { Badge } from "../ui/badge";

export interface ISectionHeading {
  __component: "blocks.section-heading";
  id: number;
  subHeading: string;
  heading: string;
  anchorLink: string;
}

const styles = {
  section: "py-16",
  container: "container mx-auto px-4 text-center",
  badge: "mb-4 uppercase tracking-wide",
  heading: "text-3xl lg:text-5xl font-bold text-foreground max-w-4xl mx-auto"
}

export function SectionHeading(props: Readonly<ISectionHeading>) {
  const { subHeading, heading, anchorLink } = props;

  return (
    <section id={anchorLink} className={styles.section}>
      <div className={styles.container}>
        <Badge variant="secondary" className={styles.badge}>
          {subHeading}
        </Badge>
        <h2 className={styles.heading}>
          {heading}
        </h2>
      </div>
    </section>
  );
}