"use client";

import type { PropsWithChildren } from "react";
import { useId, useState } from "react";

import { Text } from "@/components/atoms";

type FaqItemProps = PropsWithChildren<{
  answer: string;
  question: string;
}>;

export const FaqItem = ({ answer, question }: FaqItemProps) => {
  const answerId = useId();
  const [open, setOpen] = useState(false);

  return (
    <article className={`faq-item${open ? " faq-item--open" : ""}`} data-reveal>
      <button
        aria-controls={answerId}
        aria-expanded={open}
        className="faq-item__summary"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Text as="span" unstyled>
          {question}
        </Text>
        <span aria-hidden="true" className="faq-item__mark" />
      </button>
      <div className="faq-item__answer-shell">
        <div className="faq-item__answer" id={answerId}>
          <Text>{answer}</Text>
        </div>
      </div>
    </article>
  );
};
