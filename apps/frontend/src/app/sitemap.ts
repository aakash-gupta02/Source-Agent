import type { MetadataRoute } from "next";

import { publicRoutes, siteConfig } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: new URL(route.path, `${siteConfig.url}/`).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
