import type { HTMLAttributes, PropsWithChildren } from "react";

import styles from "./index.module.css";

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
  <Component
    className={[styles.heading, className].filter(Boolean).join(" ")}
    data-size={size}
    {...props}>
    {children}
  </Component>
);
