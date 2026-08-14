import type { PropsWithChildren } from "react";

import { Text } from "@/components/atoms/Text";
import styles from "./index.module.css";

type LogoProps = PropsWithChildren<{
  label: string;
  href: string;
  inverse?: boolean;
}>;

export const Logo = ({ href, inverse = false, label }: LogoProps) => (
  <a aria-label={label} className={styles.logo} data-inverse={inverse} href={href}>
    <Text as="span" unstyled>
      doc
    </Text>
    <Text as="span" className={styles.dot} unstyled>
      .
    </Text>
    <Text as="span" unstyled>
      io
    </Text>
  </a>
);
