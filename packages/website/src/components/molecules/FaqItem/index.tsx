import type { PropsWithChildren } from "react";

type FaqItemProps = PropsWithChildren<{
  answer: string;
  question: string;
}>;

export const FaqItem = ({ answer, question }: FaqItemProps) => (
  <details className="faq-item" data-reveal>
    <summary>
      <span>{question}</span>
      <span aria-hidden="true" className="faq-item__mark" />
    </summary>
    <div className="faq-item__answer">
      <p>{answer}</p>
    </div>
  </details>
);
