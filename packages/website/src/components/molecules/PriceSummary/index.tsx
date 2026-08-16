import type { SubscriptionPlan } from "@leadtech/common/contracts";
import type { PropsWithChildren } from "react";

import { Button, Heading, Text } from "@/components/atoms";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./index.module.css";

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
    <article className={styles.summary} data-reveal>
      <div className={styles.header}>
        <div>
          <Heading as="h3" size="card">
            {plan.name}
          </Heading>
          <Text tone="inverse">{plan.description}</Text>
        </div>
        <Text as="span" className={styles.billing} unstyled>
          {copy.billedMonthly}
        </Text>
      </div>
      <div className={styles.price}>
        <Text as="strong" unstyled>
          {formattedPrice}
        </Text>
        <Text as="span" unstyled>
          {copy.perInterval[plan.interval]}
        </Text>
      </div>
      <ul className={styles.features}>
        {plan.features.map(feature => (
          <li key={feature}>
            <span aria-hidden="true">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button href={actionHref}>{copy.action}</Button>
      <Text size="small" tone="inverse">
        {copy.terms}
      </Text>
    </article>
  );
};
