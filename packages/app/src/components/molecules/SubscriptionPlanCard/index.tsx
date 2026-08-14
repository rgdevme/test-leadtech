import { IconCheck } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";

import type { SubscriptionPlan } from "@leadtech/contracts";

import { en } from "@/data/locale/en";

type SubscriptionPlanCardProps = PropsWithChildren<{
  onSelect: (planKey: string) => void;
  plan: SubscriptionPlan;
  selected: boolean;
}>;

const formatPrice = (plan: SubscriptionPlan) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency,
    maximumFractionDigits: 0,
  }).format(plan.unitAmount / 100);

export const SubscriptionPlanCard = ({ onSelect, plan, selected }: SubscriptionPlanCardProps) => (
  <button
    aria-pressed={selected}
    className={`group relative flex h-full min-h-80 flex-col overflow-hidden rounded-xl border p-6 text-left transition duration-200 active:scale-[0.99] ${
      selected
        ? "border-charcoal bg-charcoal text-white"
        : "border-line bg-white text-charcoal hover:border-soft"
    }`}
    onClick={() => onSelect(plan.key)}
    type="button"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold tracking-[-0.025em]">{plan.name}</h3>
        <p className={`mt-2 text-sm leading-6 ${selected ? "text-white/65" : "text-muted"}`}>
          {plan.description}
        </p>
      </div>
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-full border ${
          selected ? "border-white bg-white text-charcoal" : "border-line bg-bone text-transparent"
        }`}
      >
        <IconCheck size={14} stroke={3} />
      </span>
    </div>

    <div className="mt-8 flex items-baseline gap-2">
      <span className="font-serif text-4xl tracking-[-0.04em]">{formatPrice(plan)}</span>
      <span className={`text-sm ${selected ? "text-white/60" : "text-muted"}`}>
        {en.subscription.priceConnector} {plan.interval}
      </span>
    </div>

    <ul className="mt-auto grid gap-3 pt-8 text-sm">
      {plan.features.map((feature) => (
        <li className="flex items-start gap-2.5" key={feature}>
          <IconCheck className="mt-0.5 shrink-0" size={16} stroke={2.2} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <span className="mt-6 text-xs font-bold uppercase tracking-[0.08em]">
      {selected ? en.subscription.selectedPlan : en.subscription.selectPlan}
    </span>
  </button>
);
