import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Container, Heading, Text } from "@/components/atoms";
import type { Dictionary } from "@/i18n/getDictionary";

type TrustSectionProps = PropsWithChildren<{
  copy: Dictionary["trust"];
}>;

export const TrustSection = ({ copy }: TrustSectionProps) => (
  <section className="section trust">
    <Container>
      <div className="trust__heading" data-reveal>
        <span className="eyebrow">{copy.eyebrow}</span>
        <Heading as="h2" size="section">
          {copy.title}
        </Heading>
        <Text size="lead" tone="muted">
          {copy.description}
        </Text>
      </div>
      <div className="trust__media-shell" data-media>
        <div className="trust__media-core">
          <Image
            alt={copy.imageAlt}
            height={992}
            sizes="(max-width: 767px) 100vw, 1120px"
            src="/media/trust-archive.png"
            width={1586}
          />
          <span className="trust__proof-label">{copy.proofLabel}</span>
        </div>
      </div>
      <div className="trust__assurances">
        {copy.items.map((item) => (
          <article className="trust__assurance" data-reveal key={item.title}>
            <span aria-hidden="true" className="trust__marker" />
            <Heading as="h3" size="card">
              {item.title}
            </Heading>
            <Text tone="muted">{item.description}</Text>
          </article>
        ))}
      </div>
    </Container>
  </section>
);
