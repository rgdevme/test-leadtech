import logo from "@leadtech/common/assets/logo.svg";
import { brandLocale } from "@leadtech/common/data/locale/en";
import Image from "next/image";
import type { PropsWithChildren } from "react";

import styles from "./index.module.css";

type LogoProps = PropsWithChildren<{
  href: string;
  inverse?: boolean;
}>;

export const Logo = ({ href, inverse = false }: LogoProps) => (
  <a aria-label={brandLocale.logoLabel} className={styles.logo} data-inverse={inverse} href={href}>
    <Image alt="" aria-hidden="true" className={styles.image} priority src={logo} />
  </a>
);
