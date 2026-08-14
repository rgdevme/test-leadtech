import type { HTMLAttributes, PropsWithChildren } from "react";

type HeadingProps = PropsWithChildren<
  HTMLAttributes<HTMLHeadingElement> & {
    as: "h1" | "h2" | "h3";
    size: "display" | "section" | "card";
  }
>;

export const Heading = ({
  as: Component,
  children,
  className = "",
  size,
  ...props
}: HeadingProps) => (
  <Component className={`heading heading--${size} ${className}`} {...props}>
    {children}
  </Component>
);
