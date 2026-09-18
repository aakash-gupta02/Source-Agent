import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";

import { ProtectedAppShell } from "./protected-app-shell";

export default function AppSectionLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProtectedAppShell>{children}</ProtectedAppShell>
    </ThemeProvider>
  );
}
