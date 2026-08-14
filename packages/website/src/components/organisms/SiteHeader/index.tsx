import type { PropsWithChildren } from "react";

import { Container } from "@/components/atoms";
import { useComponentSlots } from "@/hooks/useComponentSlots";

import { Actions } from "./components/Actions";
import { Brand } from "./components/Brand";
import { Navigation } from "./components/Navigation";

type SiteHeaderProps = PropsWithChildren<{
  menuLabel: string;
}>;

const SiteHeader = ({ children, menuLabel }: SiteHeaderProps) => {
  const slots = useComponentSlots(
    { actions: Actions, brand: Brand, navigation: Navigation },
    children,
  );

  return (
    <header className="site-header">
      <Container size="wide">
        <div className="site-header__island">
          {slots.brand}
          <nav aria-label={menuLabel} className="site-header__desktop-nav">
            {slots.navigation}
          </nav>
          <div className="site-header__desktop-actions">{slots.actions}</div>
          <details className="site-header__mobile-menu">
            <summary aria-label={menuLabel}>
              <span className="site-header__hamburger" aria-hidden="true">
                <i />
                <i />
              </span>
            </summary>
            <div className="site-header__mobile-overlay">
              <nav aria-label={menuLabel}>{slots.navigation}</nav>
              {slots.actions}
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
};

SiteHeader.Brand = Brand;
SiteHeader.Navigation = Navigation;
SiteHeader.Actions = Actions;

export { SiteHeader };
