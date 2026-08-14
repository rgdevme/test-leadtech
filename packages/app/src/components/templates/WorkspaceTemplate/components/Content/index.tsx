import type { PropsWithChildren } from "react";

type ContentProps = PropsWithChildren;

export function Content({ children }: ContentProps) {
  return <div>{children}</div>;
}
