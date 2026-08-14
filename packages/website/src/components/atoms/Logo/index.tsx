import type { PropsWithChildren } from "react";

type LogoProps = PropsWithChildren<{
  label: string;
  href: string;
  inverse?: boolean;
}>;

export const Logo = ({ href, inverse = false, label }: LogoProps) => (
  <a aria-label={label} className={`logo${inverse ? " logo--inverse" : ""}`} href={href}>
    <span>doc</span>
    <span className="logo__dot">.</span>
    <span>io</span>
  </a>
);
