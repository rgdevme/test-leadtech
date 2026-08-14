import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Button, Container, Heading, Logo, Text } from "@/components/atoms";
import type { Dictionary } from "@/i18n/getDictionary";

type FooterProps = PropsWithChildren<{
  copy: Dictionary["footer"];
  homeHref: string;
  primaryHref: string;
  signInHref: string;
}>;

export const Footer = ({ copy, homeHref, primaryHref, signInHref }: FooterProps) => (
  <footer className="footer">
    <Container size="wide">
      <div className="footer__cta-shell" data-media>
        <div className="footer__cta-core">
          <Image
            alt={copy.imageAlt}
            className="footer__image"
            fill
            sizes="100vw"
            src="/media/closing-document.png"
          />
          <div className="footer__scrim" />
          <div className="footer__copy" data-reveal>
            <Heading as="h2" size="section">
              {copy.title}
            </Heading>
            <Text size="lead" tone="inverse">
              {copy.description}
            </Text>
            <div className="footer__actions">
              <Button href={primaryHref}>{copy.action}</Button>
              <Button href={signInHref} showArrow={false} variant="text">
                {copy.signIn}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__meta">
        <div>
          <Logo href={homeHref} inverse label={copy.product} />
          <Text as="span" unstyled>
            {copy.descriptor}
          </Text>
        </div>
        <Text as="span" unstyled>
          {copy.copyright}
        </Text>
      </div>
    </Container>
  </footer>
);
