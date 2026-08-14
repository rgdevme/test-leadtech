import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Container, Heading, Text } from "@/components/atoms";
import { FaqItem } from "@/components/molecules";
import type { Dictionary } from "@/i18n/getDictionary";

type FaqSectionProps = PropsWithChildren<{
  copy: Dictionary["faq"];
}>;

export const FaqSection = ({ copy }: FaqSectionProps) => (
  <section className="section faq" id="faq">
    <Container>
      <div className="faq__heading" data-reveal>
        <Text as="span" className="eyebrow eyebrow--inverse" unstyled>
          {copy.eyebrow}
        </Text>
        <Heading as="h2" size="section">
          {copy.title}
        </Heading>
      </div>
      <div className="faq__layout">
        <div className="faq__items">
          {copy.items.map((item) => (
            <FaqItem key={item.question} {...item} />
          ))}
        </div>
        <div className="faq__media-shell" data-media>
          <div className="faq__media-core">
            <Image
              alt={copy.imageAlt}
              height={992}
              sizes="(max-width: 767px) 100vw, 42vw"
              src="/media/faq-accordion.png"
              width={1586}
            />
          </div>
        </div>
      </div>
    </Container>
  </section>
);
