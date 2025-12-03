import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Text } from "@/components/retroui/Text";

export interface IFaqs {
  __component: "blocks.faqs";
  id: number;
  heading?: string;
  subHeading?: string;
  faq: Array<{
    id: number;
    heading: string;
    text: string;
  }>;
}

export function Faqs(props: Readonly<IFaqs>) {
  const { heading, subHeading, faq } = props;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 bg-[#f5f3e8]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <Text as="h2" className="mb-2">
            {heading || "Frequently Asked Questions"}
          </Text>
          {subHeading && (
            <Text className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subHeading}
            </Text>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          {faq.map((item, index) => (
            <div
              key={item.id}
              className={`mb-4 border-4 border-black transition-all duration-200 ease-in bg-white ${openIndex === index ? "shadow-lg" : "shadow-md"}`}
            >
              <button
                className="flex justify-between items-center w-full p-5 text-left font-bold text-lg focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span>{item.heading}</span>
                <ChevronDown
                  className={`transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
                  size={24}
                />
              </button>
              <div
                id={`faq-answer-${item.id}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-5" : "max-h-0"
                }`}
                aria-hidden={openIndex !== index}
              >
                <div className="px-5 border-t-2 border-dashed border-black pt-4">
                  <Text className="text-muted-foreground">{item.text}</Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
