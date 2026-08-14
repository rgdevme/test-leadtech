import type { PropsWithChildren } from "react";

type TextProps = PropsWithChildren<{
  as?: "p" | "span";
  tone?: "default" | "muted" | "inverse";
  size?: "small" | "body" | "lead";
}>;

export const Text = ({
  as: Component = "p",
  children,
  size = "body",
  tone = "default",
}: TextProps) => <Component className={`text text--${size} text--${tone}`}>{children}</Component>;
