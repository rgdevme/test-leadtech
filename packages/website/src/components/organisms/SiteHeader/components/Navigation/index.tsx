import type { PropsWithChildren } from "react";

import styles from "./index.module.css";

type NavigationProps = PropsWithChildren;

export function Navigation({ children }: NavigationProps) {
  return <div className={styles.navigation}>{children}</div>;
}
