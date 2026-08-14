"use client";

import { useRef } from "react";
import type { PropsWithChildren } from "react";

import { useMarketingMotion } from "./hooks/useMarketingMotion";

type MarketingMotionProps = PropsWithChildren;

export const MarketingMotion = ({ children }: MarketingMotionProps) => {
  const scope = useRef<HTMLDivElement>(null);
  useMarketingMotion(scope);

  return (
    <div className="marketing-motion" ref={scope}>
      {children}
    </div>
  );
};
