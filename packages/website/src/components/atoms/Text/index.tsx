import type { HTMLAttributes, PropsWithChildren } from "react";

type TextProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: "em" | "p" | "span" | "strong";
    tone?: "default" | "muted" | "inverse";
    size?: "small" | "body" | "lead";
    unstyled?: boolean;
  }
>;

export const Text = ({
  as: Component = "p",
  children,
  className = "",
  size = "body",
  tone = "default",
  unstyled = false,
  ...props
}: TextProps) => (
  <Component
    className={unstyled ? className : `text text--${size} text--${tone} ${className}`}
    {...props}
  >
    {children}
  </Component>
);
