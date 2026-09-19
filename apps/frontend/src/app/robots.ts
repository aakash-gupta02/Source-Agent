import type { MetadataRoute } from "next";

import { noIndexPaths, siteConfig } from "@/config/seo";

const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Anthropic-AI",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llm.txt", "/llms-full.txt"],
        disallow: [...noIndexPaths],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: ["/", "/llms.txt", "/llm.txt", "/llms-full.txt"],
        disallow: [...noIndexPaths],
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
