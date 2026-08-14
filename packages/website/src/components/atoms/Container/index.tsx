import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  size?: "default" | "wide";
}>;

export const Container = ({ children, size = "default" }: ContainerProps) => (
  <div className={`container container--${size}`}>{children}</div>
);
