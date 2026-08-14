import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

type LinkProps = PropsWithChildren<NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>>;

export const Link = ({ children, className = "", ...props }: LinkProps) => (
  <NextLink
    className={`text-sm font-semibold text-charcoal underline decoration-line underline-offset-4 transition hover:decoration-charcoal ${className}`}
    {...props}
  >
    {children}
  </NextLink>
);
