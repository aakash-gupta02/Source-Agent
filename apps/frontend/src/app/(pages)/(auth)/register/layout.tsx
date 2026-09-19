import type { ReactNode } from "react";
import type { Metadata } from "next";

import { privatePageMetadata } from "@/config/seo";

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: "Create an account",
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
