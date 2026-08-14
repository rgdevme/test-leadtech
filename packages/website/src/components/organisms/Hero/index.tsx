import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Button, Container, Heading, Text } from "@/components/atoms";
import type { Dictionary } from "@/i18n/getDictionary";

type HeroProps = PropsWithChildren<{
  copy: Dictionary["hero"];
  primaryHref: string;
}>;

export const Hero = ({ copy, primaryHref }: HeroProps) => (
  <section className="hero">
    <Container size="wide">
      <div className="hero__copy" data-reveal>
        <Text as="span" className="eyebrow" unstyled>
          {copy.eyebrow}
        </Text>
        <Heading as="h1" size="display">
          <Text as="span" unstyled>
            {copy.titleLead}
          </Text>
          <Text as="em" unstyled>
            {copy.titleAccent}
          </Text>
        </Heading>
        <div className="hero__support">
          <Text size="lead" tone="muted">
            {copy.description}
          </Text>
          <div className="hero__actions">
            <Button href={primaryHref}>{copy.primaryAction}</Button>
            <Button href="#workflow" showArrow={false} variant="text">
              {copy.secondaryAction}
            </Button>
          </div>
        </div>
      </div>
      <div className="hero__visual-shell" data-media>
        <div className="hero__visual-core">
          <Image
            alt={copy.imageAlt}
            className="hero__image"
            height={992}
            priority
            sizes="(max-width: 767px) 100vw, 94vw"
            src="/media/hero-editor.png"
            width={1586}
          />
          <Text as="span" className="hero__note" unstyled>
            {copy.note}
          </Text>
        </div>
      </div>
    </Container>
  </section>
);
