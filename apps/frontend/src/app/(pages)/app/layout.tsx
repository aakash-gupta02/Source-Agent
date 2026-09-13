"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AppLayout } from "@/components/app-layout";
import { useCurrentUser } from "@/features/auth/hooks";
import { LOGIN_ROUTE } from "@/features/auth/routes";

export default function ProtectedAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { data: user, isPending } = useCurrentUser();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(LOGIN_ROUTE);
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin text-gray-400" />
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  return (
    <AppLayout user={user}>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </AppLayout>
  );
}
