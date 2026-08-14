import type { PropsWithChildren } from "react";

import { Heading, Text } from "@/components/atoms";

type BenefitItemProps = PropsWithChildren<{
  description: string;
  index: string;
  title: string;
}>;

export const BenefitItem = ({ description, index, title }: BenefitItemProps) => (
  <article className="benefit-item" data-reveal>
    <span aria-hidden="true" className="benefit-item__index">
      {index}
    </span>
    <div>
      <Heading as="h3" size="card">
        {title}
      </Heading>
      <Text tone="muted">{description}</Text>
    </div>
  </article>
);
