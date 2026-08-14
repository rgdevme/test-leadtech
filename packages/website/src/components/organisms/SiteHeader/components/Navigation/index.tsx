import type { PropsWithChildren } from "react";

type NavigationProps = PropsWithChildren;

export function Navigation({ children }: NavigationProps) {
  return <div className="site-header__navigation">{children}</div>;
}
