import favicon from "@leadtech/common/assets/favicon.svg";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import type { PropsWithChildren } from "react";

import { environment } from "@/config/environment";
import { defaultLocale } from "@/i18n/config";

import "./globals.css";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-outfit",
});

type RootLayoutProps = PropsWithChildren;

export const metadata: Metadata = {
  icons: { icon: favicon.src },
  metadataBase: environment.siteUrl,
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2efe6",
  width: "device-width",
  initialScale: 1,
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html className={outfit.variable} lang={defaultLocale}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
