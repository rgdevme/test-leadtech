import type { PropsWithChildren } from "react";

type HeaderProps = PropsWithChildren;

export function Header({ children }: HeaderProps) {
  return <div className="mb-10 sm:mb-14">{children}</div>;
}
