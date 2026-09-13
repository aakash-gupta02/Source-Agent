import type { ReactNode } from "react";

import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card px-8 py-9">
        <Logo className="mb-6" />
        {children}
      </section>
    </main>
  );
}
