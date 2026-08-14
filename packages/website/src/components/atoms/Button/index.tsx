import type { PropsWithChildren } from "react";

import { Text } from "@/components/atoms/Text";

type ButtonProps = PropsWithChildren<{
  href: string;
  variant?: "primary" | "secondary" | "text";
  showArrow?: boolean;
}>;

export const Button = ({ children, href, variant = "primary", showArrow = true }: ButtonProps) => (
  <a className={`button button--${variant} group`} href={href}>
    <Text as="span" unstyled>
      {children}
    </Text>
    {showArrow ? (
      <span aria-hidden="true" className="button__arrow">
        ↗
      </span>
    ) : null}
  </a>
);
