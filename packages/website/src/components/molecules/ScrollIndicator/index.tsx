import type { PropsWithChildren } from "react";

import { Text } from "@/components/atoms";

type ScrollIndicatorProps = PropsWithChildren<{
  href: string;
  label: string;
}>;

export const ScrollIndicator = ({ href, label }: ScrollIndicatorProps) => (
  <a className="scroll-indicator" href={href}>
    <Text as="span" size="small" unstyled>
      {label}
    </Text>
    <span aria-hidden="true" className="scroll-indicator__rail" />
  </a>
);
