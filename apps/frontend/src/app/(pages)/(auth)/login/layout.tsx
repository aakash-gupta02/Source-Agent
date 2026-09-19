import type { ReactNode } from "react";
import type { Metadata } from "next";

import { privatePageMetadata } from "@/config/seo";

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: "Sign in",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
