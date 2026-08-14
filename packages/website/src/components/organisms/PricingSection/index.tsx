import type { SubscriptionPlan } from "@leadtech/contracts";
import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Container, Heading, Text } from "@/components/atoms";
import { PriceSummary } from "@/components/molecules";
import type { Dictionary } from "@/i18n/getDictionary";

type PricingSectionProps = PropsWithChildren<{
  actionHref: string;
  copy: Dictionary["pricing"];
  locale: string;
  plan: SubscriptionPlan;
}>;

export const PricingSection = ({ actionHref, copy, locale, plan }: PricingSectionProps) => (
  <section className="section pricing" id="pricing">
    <Container>
      <div className="pricing__heading" data-reveal>
        <span className="eyebrow">{copy.eyebrow}</span>
        <Heading as="h2" size="section">
          {copy.title}
        </Heading>
        <Text size="lead" tone="muted">
          {copy.description}
        </Text>
      </div>
      <div className="pricing__layout">
        <PriceSummary actionHref={actionHref} copy={copy} locale={locale} plan={plan} />
        <div className="pricing__media-shell" data-media>
          <div className="pricing__media-core">
            <Image
              alt={copy.imageAlt}
              height={992}
              sizes="(max-width: 767px) 100vw, 48vw"
              src="/media/pricing-card.png"
              width={1586}
            />
          </div>
        </div>
      </div>
    </Container>
  </section>
);
