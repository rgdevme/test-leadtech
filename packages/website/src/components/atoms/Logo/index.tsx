import type { PropsWithChildren } from "react";

import { Text } from "@/components/atoms/Text";

type LogoProps = PropsWithChildren<{
  label: string;
  href: string;
  inverse?: boolean;
}>;

export const Logo = ({ href, inverse = false, label }: LogoProps) => (
  <a aria-label={label} className={`logo${inverse ? " logo--inverse" : ""}`} href={href}>
    <Text as="span" unstyled>
      doc
    </Text>
    <Text as="span" className="logo__dot" unstyled>
      .
    </Text>
    <Text as="span" unstyled>
      io
    </Text>
  </a>
);
