import type { PropsWithChildren } from "react";

type HeadingProps = PropsWithChildren<{
  as: "h1" | "h2" | "h3";
  size: "display" | "section" | "card";
}>;

export const Heading = ({ as: Component, children, size }: HeadingProps) => (
  <Component className={`heading heading--${size}`}>{children}</Component>
);
