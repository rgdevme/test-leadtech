import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Container, Heading, Text } from "@/components/atoms";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./index.module.css";

type TrustSectionProps = PropsWithChildren<{
  copy: Dictionary["trust"];
}>;

export const TrustSection = ({ copy }: TrustSectionProps) => (
  <section className={styles.section}>
    <Container>
      <div className={styles.heading} data-reveal>
        <Text as="span" variant="eyebrow">
          {copy.eyebrow}
        </Text>
        <Heading as="h2" size="section">
          {copy.title}
        </Heading>
        <Text size="lead" tone="muted">
          {copy.description}
        </Text>
      </div>
      <div className={styles.mediaShell} data-media>
        <div className={styles.mediaCore}>
          <Image
            alt={copy.imageAlt}
            height={992}
            sizes="(max-width: 767px) 100vw, 1120px"
            src="/media/trust-archive.png"
            width={1586}
          />
          <Text as="span" className={styles.proofLabel} unstyled>
            {copy.proofLabel}
          </Text>
        </div>
      </div>
      <div className={styles.assurances}>
        {copy.items.map(item => (
          <article className={styles.assurance} data-reveal key={item.title}>
            <span aria-hidden="true" className={styles.marker} />
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
