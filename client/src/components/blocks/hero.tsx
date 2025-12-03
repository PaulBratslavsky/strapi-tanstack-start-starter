import { ArrowUpRight } from "lucide-react";
import type { TImage, TLink } from "@/types";
import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
import { StrapiImage } from "@/components/custom/strapi-image";
import { SmartLink } from "@/components/custom/smart-link";

export interface IHero {
  __component: "blocks.hero";
  id: number;
  subHeading?: string;
  heading: string;
  highlightedText?: string;
  text: string;
  links: Array<TLink>;
  image: TImage;
}

export function Hero({
  subHeading,
  heading,
  highlightedText,
  text,
  links,
  image,
}: Readonly<IHero>) {
  return (
    <section className="bg-[#F9F5F2] py-20 px-4 lg:px-8 border-y-3 border-black">
      <div className="container max-w-6xl w-full mx-auto">
        <div className="flex flex-col md:flex-row w-full justify-between items-center gap-8 md:gap-12 xl:gap-16">
          {/* === Left Column: Text Content === */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
            {subHeading && (
              <Text className="text-base lg:text-lg">{subHeading}</Text>
            )}

            <Text as="h1" className="font-medium mt-4">
              {heading}
              {highlightedText && (
                <>
                  <br />
                  <span className="inline-block px-2 bg-[#e7f192] border-3 rotate-3 mt-3">
                    {highlightedText}
                  </span>
                </>
              )}
            </Text>

            <Text className="text-base lg:text-lg mt-4">{text}</Text>

            {links.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-8">
                {links.map((link, index) => (
                  <Button
                    key={link.id}
                    className={
                      index === 0
                        ? "bg-[#c4a1ff] hover:bg-[#b488ff]"
                        : undefined
                    }
                    variant={link.type === "SECONDARY" ? "outline" : "default"}
                    size="lg"
                    asChild
                  >
                    <SmartLink href={link.href}>
                      {link.label}
                      {index === 0 && <ArrowUpRight className="ml-2 w-5 h-5" />}
                    </SmartLink>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* === Right Column: Image === */}
          <div className="flex-1 flex justify-center md:justify-end items-center w-full order-1 md:order-2">
            <div className="relative w-full">
              <StrapiImage
                src={image.url}
                alt={image.alternativeText || heading}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
