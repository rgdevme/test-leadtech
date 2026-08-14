import type { PropsWithChildren } from "react";

type ActionsProps = PropsWithChildren;

export function Actions({ children }: ActionsProps) {
  return <div className="site-header__actions">{children}</div>;
}
