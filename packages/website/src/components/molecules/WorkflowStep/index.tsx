import type { PropsWithChildren } from "react";

import { Heading, Text } from "@/components/atoms";

type WorkflowStepProps = PropsWithChildren<{
  description: string;
  index: string;
  title: string;
}>;

export const WorkflowStep = ({ description, index, title }: WorkflowStepProps) => (
  <article className="workflow-step" data-reveal>
    <Text as="span" className="workflow-step__index" unstyled>
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
