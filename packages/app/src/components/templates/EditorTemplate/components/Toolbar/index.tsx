import type { PropsWithChildren } from "react";

type ToolbarProps = PropsWithChildren;

export function Toolbar({ children }: ToolbarProps) {
  return (
    <div className="sticky top-[4.5rem] z-20 border-b border-line bg-canvas/92 px-5 py-2 backdrop-blur-xl sm:px-8">
      {children}
    </div>
  );
}
