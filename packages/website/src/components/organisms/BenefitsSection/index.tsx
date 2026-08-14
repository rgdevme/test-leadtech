import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Container, Heading, Text } from "@/components/atoms";
import { BenefitItem } from "@/components/molecules";
import type { Dictionary } from "@/i18n/getDictionary";

type BenefitsSectionProps = PropsWithChildren<{
  copy: Dictionary["benefits"];
}>;

export const BenefitsSection = ({ copy }: BenefitsSectionProps) => (
  <section className="section benefits" id="benefits">
    <Container>
      <div className="section-heading" data-reveal>
        <span className="eyebrow">{copy.eyebrow}</span>
        <Heading as="h2" size="section">
          {copy.title}
        </Heading>
        <Text size="lead" tone="muted">
          {copy.description}
        </Text>
      </div>
      <div className="benefits__media-shell" data-media>
        <div className="benefits__media-core">
          <Image
            alt={copy.imageAlt}
            height={1024}
            sizes="(max-width: 767px) 100vw, 1120px"
            src="/media/benefits-editor.png"
            width={1536}
          />
        </div>
      </div>
      <div className="benefits__grid">
        {copy.items.map((item) => (
          <BenefitItem key={item.index} {...item} />
        ))}
      </div>
    </Container>
  </section>
);
