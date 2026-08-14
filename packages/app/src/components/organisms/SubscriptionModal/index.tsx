"use client";

import {
  createCheckoutResponseSchema,
  listSubscriptionPlansResponseSchema,
  type SubscriptionPlan,
} from "@leadtech/contracts";
import { IconArrowRight, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";
import { Heading } from "@/components/atoms/Heading";
import { IconButton } from "@/components/atoms/IconButton";
import { Text } from "@/components/atoms/Text";
import { SubscriptionPlanCard } from "@/components/molecules/SubscriptionPlanCard";
import { en } from "@/data/locale/en";
import { requestJson } from "@/utils/apiClient";

type SubscriptionModalProps = PropsWithChildren<{
  initialPlanKey?: string;
  onClose: () => void;
  open: boolean;
}>;

export const SubscriptionModal = ({ initialPlanKey, onClose, open }: SubscriptionModalProps) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [plansLoaded, setPlansLoaded] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || plansLoaded || loading) {
      return;
    }

    const loadPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await requestJson(
          "/api/billing/plans",
          { method: "GET", cache: "no-store" },
          listSubscriptionPlansResponseSchema,
        );
        setPlans(response.items);
        const requestedPlan = response.items.find((plan) => plan.key === initialPlanKey);
        const featuredPlan = response.items.find((plan) => plan.featured);
        setSelectedPlanKey(
          requestedPlan?.key ?? featuredPlan?.key ?? response.items[0]?.key ?? null,
        );
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : en.documents.mutationError);
      } finally {
        setLoading(false);
        setPlansLoaded(true);
      }
    };

    void loadPlans();
  }, [initialPlanKey, loading, open, plansLoaded]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.key === selectedPlanKey) ?? null,
    [plans, selectedPlanKey],
  );

  const startCheckout = async () => {
    if (!selectedPlan) {
      return;
    }

    setCheckoutLoading(true);
    setError(null);
    try {
      const response = await requestJson(
        "/api/billing/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": crypto.randomUUID(),
          },
          body: JSON.stringify({ intent: "subscribe", planKey: selectedPlan.key }),
        },
        createCheckoutResponseSchema,
      );
      window.location.assign(response.checkoutUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : en.documents.mutationError);
      setCheckoutLoading(false);
    }
  };

  return (
    <Dialog labelledBy="subscription-modal-title" onClose={onClose} open={open}>
      <div className="max-h-[92vh] overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <Heading className="text-3xl sm:text-4xl" id="subscription-modal-title" level={2} serif>
              {en.subscription.modalTitle}
            </Heading>
            <Text className="mt-3">{en.subscription.modalDescription}</Text>
          </div>
          <IconButton label={en.common.close} onClick={onClose}>
            <IconX size={20} stroke={1.8} />
          </IconButton>
        </div>

        {loading ? (
          <div className="grid min-h-80 place-items-center text-sm text-muted">
            {en.common.loading}
          </div>
        ) : plans.length > 0 ? (
          <div className="mt-8 grid grid-flow-dense grid-cols-1 gap-3 lg:grid-cols-12">
            {plans.map((plan) => (
              <div className="lg:col-span-4" key={plan.key}>
                <SubscriptionPlanCard
                  onSelect={setSelectedPlanKey}
                  plan={plan}
                  selected={selectedPlanKey === plan.key}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-line bg-bone p-8 text-center">
            <Heading className="text-xl" level={3}>
              {en.subscription.unavailable}
            </Heading>
            <Text className="mt-2 text-sm">{en.subscription.unavailableDescription}</Text>
          </div>
        )}

        {error ? (
          <p className="mt-5 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-line pt-6 sm:flex-row">
          <Button onClick={onClose} variant="secondary">
            {en.subscription.dismiss}
          </Button>
          <Button
            disabled={!selectedPlan}
            loading={checkoutLoading}
            onClick={() => void startCheckout()}
          >
            {en.subscription.confirm}
            {!checkoutLoading ? <IconArrowRight size={18} stroke={2} /> : null}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
