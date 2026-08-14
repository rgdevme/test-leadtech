import type { PropsWithChildren } from "react";

import styles from "./index.module.css";

type BrandProps = PropsWithChildren;

export function Brand({ children }: BrandProps) {
  return <div className={styles.brand}>{children}</div>;
}
