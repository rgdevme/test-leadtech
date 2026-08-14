import type { PropsWithChildren } from "react";

import { Heading, Text } from "@/components/atoms";
import styles from "./index.module.css";

type BenefitItemProps = PropsWithChildren<{
  description: string;
  index: string;
  title: string;
}>;

export const BenefitItem = ({ description, index, title }: BenefitItemProps) => (
  <article className={styles.item} data-reveal>
    <Text as="span" aria-hidden="true" className={styles.index} unstyled>
      {index}
    </Text>
    <div>
      <Heading as="h3" size="card">
        {title}
      </Heading>
      <Text tone="muted">{description}</Text>
    </div>
  </article>
);
