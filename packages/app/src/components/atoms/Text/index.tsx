import type { HTMLAttributes, PropsWithChildren } from "react";

type TextProps = PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>;

export const Text = ({ children, className = "", ...props }: TextProps) => (
  <p className={`leading-7 text-muted ${className}`} {...props}>
    {children}
  </p>
);
