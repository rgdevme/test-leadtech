"use client";

import { IconAt } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";

import type { AuthUser, SubscriptionResponse } from "@leadtech/contracts";

import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { SubscriptionPanel } from "@/components/organisms/SubscriptionPanel";
import { WorkspaceTemplate } from "@/components/templates/WorkspaceTemplate";
import { en } from "@/data/locale/en";

type ProfilePageProps = PropsWithChildren<{
  principal: AuthUser;
  subscription: SubscriptionResponse;
}>;

export const ProfilePage = ({ principal, subscription }: ProfilePageProps) => (
  <WorkspaceTemplate>
    <WorkspaceTemplate.Header>
      <div className="max-w-4xl" data-reveal>
        <Heading className="max-w-5xl text-[clamp(3rem,7vw,6rem)] leading-[0.92]" level={1} serif>
          {en.profile.title}
        </Heading>
        <Text className="mt-6 max-w-xl">{en.profile.description}</Text>
      </div>
    </WorkspaceTemplate.Header>
    <WorkspaceTemplate.Content>
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <section className="rounded-xl border border-line bg-white p-6 sm:p-8" data-reveal>
          <span className="grid size-10 place-items-center rounded-lg bg-pale-blue text-accent-blue">
            <IconAt size={21} stroke={1.8} />
          </span>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.08em] text-muted">
            {en.profile.signedInAs}
          </p>
          <p className="mt-2 break-all text-lg font-semibold text-charcoal">{principal.email}</p>
        </section>
        <div data-reveal>
          <SubscriptionPanel subscription={subscription} />
        </div>
      </div>
    </WorkspaceTemplate.Content>
  </WorkspaceTemplate>
);
