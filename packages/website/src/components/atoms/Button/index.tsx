import type { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  href: string;
  variant?: "primary" | "secondary" | "text";
  showArrow?: boolean;
}>;

export const Button = ({ children, href, variant = "primary", showArrow = true }: ButtonProps) => (
  <a className={`button button--${variant} group`} href={href}>
    <span>{children}</span>
    {showArrow ? (
      <span aria-hidden="true" className="button__arrow">
        ↗
      </span>
    ) : null}
  </a>
);
