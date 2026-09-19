import type { ReactNode } from "react";

import { privatePageMetadata } from "@/config/seo";

export const metadata = privatePageMetadata;

export default function StaticLayout({ children }: { children: ReactNode }) {
  return children;
}
