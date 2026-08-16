import type { MetadataRoute } from "next";

import { en } from "@/data/locale/en";

const manifest = (): MetadataRoute.Manifest => {
  return {
    name: en.metadata.applicationName,
    short_name: en.brand.name,
    description: en.metadata.description,
    start_url: "/en",
    display: "browser",
    background_color: "#f2efe6",
    theme_color: "#f2efe6",
  };
};

export default manifest;
