import { Text } from "@/components/retroui/Text";

export interface ISectionHeading {
  __component: "blocks.section-heading";
  id: number;
  subHeading: string;
  heading: string;
  anchorLink?: string;
}

export function SectionHeading(props: Readonly<ISectionHeading>) {
  const { subHeading, heading, anchorLink } = props;

  return (
    <section id={anchorLink} className="bg-[#F9F5F2]">
      <div className="w-full container max-w-6xl px-4 xl:px-0 pt-20 pb-10 mx-auto text-start">
        <Text className="mb-2 text-xl">{subHeading}</Text>
        <Text as="h2">{heading}</Text>
      </div>
    </section>
  );
}
