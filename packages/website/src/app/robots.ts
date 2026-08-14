import type { MetadataRoute } from "next";

import { environment } from "@/config/environment";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", environment.siteUrl).toString(),
    host: environment.siteUrl.origin,
  };
};

export default robots;
