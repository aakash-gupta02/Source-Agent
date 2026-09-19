import { getJsonLdGraph } from "@/config/seo";

export function JsonLd() {
  const graph = getJsonLdGraph();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
