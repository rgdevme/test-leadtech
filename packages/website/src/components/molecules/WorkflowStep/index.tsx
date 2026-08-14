import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Heading, Text } from "@/components/atoms";
import styles from "./index.module.css";

type WorkflowStepProps = PropsWithChildren<{
  description: string;
  imageSrc: string;
  index: string;
  title: string;
}>;

export const WorkflowStep = ({ description, imageSrc, index, title }: WorkflowStepProps) => (
  <article className={styles.step} data-reveal>
    <Image alt="" aria-hidden="true" className={styles.image} fill sizes="30vw" src={imageSrc} />
    <Text as="span" className={styles.index} unstyled>
      {index}
    </Text>
    <div>
      <Heading as="h3" size="card">
        {title}
      </Heading>
      <Text tone="inverse">{description}</Text>
    </div>
  </article>
);
