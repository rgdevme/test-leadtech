import type { PropsWithChildren } from "react";

type HeaderProps = PropsWithChildren;

export function Header({ children }: HeaderProps) {
  return <>{children}</>;
}
