import type { PropsWithChildren } from "react";

import { Text } from "@/components/atoms";

type FaqItemProps = PropsWithChildren<{
  answer: string;
  question: string;
}>;

export const FaqItem = ({ answer, question }: FaqItemProps) => (
  <details className="faq-item" data-reveal>
    <summary>
      <Text as="span" unstyled>
        {question}
      </Text>
      <span aria-hidden="true" className="faq-item__mark" />
    </summary>
    <div className="faq-item__answer">
      <Text>{answer}</Text>
    </div>
  </details>
);
