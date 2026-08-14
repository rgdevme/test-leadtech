import type { PropsWithChildren } from "react";

type BrandProps = PropsWithChildren;

export function Brand({ children }: BrandProps) {
  return <div className="site-header__brand">{children}</div>;
}
