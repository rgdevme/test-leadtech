import type { SubscriptionPlan } from "@leadtech/contracts";
import type { PropsWithChildren } from "react";

import { Button, Heading, Text } from "@/components/atoms";
import type { Dictionary } from "@/i18n/getDictionary";

type PriceSummaryProps = PropsWithChildren<{
  actionHref: string;
  copy: Dictionary["pricing"];
  locale: string;
  plan: SubscriptionPlan;
}>;

export const PriceSummary = ({ actionHref, copy, locale, plan }: PriceSummaryProps) => {
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: plan.currency,
    maximumFractionDigits: 0,
  }).format(plan.unitAmount / 100);

  return (
    <article className="price-summary" data-reveal>
      <div className="price-summary__header">
        <div>
          <Heading as="h3" size="card">
            {plan.name}
          </Heading>
          <Text tone="muted">{plan.description}</Text>
        </div>
        <Text as="span" className="price-summary__billing" unstyled>
          {copy.billedMonthly}
        </Text>
      </div>
      <div className="price-summary__price">
        <Text as="strong" unstyled>
          {formattedPrice}
        </Text>
        <Text as="span" unstyled>
          {copy.perInterval[plan.interval]}
        </Text>
      </div>
      <ul className="price-summary__features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span aria-hidden="true">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button href={actionHref}>{copy.action}</Button>
      <Text size="small" tone="muted">
        {copy.terms}
      </Text>
    </article>
  );
};
