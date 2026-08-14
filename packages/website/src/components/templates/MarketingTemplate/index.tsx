import type { PropsWithChildren } from "react";

import { MarketingMotion } from "@/components/organisms/MarketingMotion";
import { useComponentSlots } from "@/hooks/useComponentSlots";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import styles from "./index.module.css";

type MarketingTemplateProps = PropsWithChildren<{
  skipLinkLabel: string;
}>;

const MarketingTemplate = ({ children, skipLinkLabel }: MarketingTemplateProps) => {
  const slots = useComponentSlots({ footer: Footer, header: Header, main: Main }, children);

  return (
    <MarketingMotion>
      <a className={styles.skipLink} href="#main-content">
        {skipLinkLabel}
      </a>
      {slots.header}
      <main id="main-content">{slots.main}</main>
      {slots.footer}
    </MarketingMotion>
  );
};

MarketingTemplate.Header = Header;
MarketingTemplate.Main = Main;
MarketingTemplate.Footer = Footer;

export { MarketingTemplate };
