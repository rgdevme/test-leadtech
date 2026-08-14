import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Button, Container, Heading, Logo, Text } from "@/components/atoms";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./index.module.css";

type FooterProps = PropsWithChildren<{
  copy: Dictionary["footer"];
  homeHref: string;
  primaryHref: string;
  signInHref: string;
}>;

export const Footer = ({ copy, homeHref, primaryHref, signInHref }: FooterProps) => (
  <footer className={styles.footer}>
    <Container size="wide">
      <div className={styles.ctaShell} data-media>
        <div className={styles.ctaCore}>
          <Image
            alt={copy.imageAlt}
            className={styles.image}
            fill
            sizes="100vw"
            src="/media/closing-document.png"
          />
          <div className={styles.scrim} />
          <div className={styles.copy} data-reveal>
            <Heading as="h2" size="section">
              {copy.title}
            </Heading>
            <Text size="lead" tone="inverse">
              {copy.description}
            </Text>
            <div className={styles.actions}>
              <Button href={primaryHref}>{copy.action}</Button>
              <Button href={signInHref} showArrow={false} variant="text">
                {copy.signIn}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.meta}>
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
