"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useCurrentUser } from "@/features/auth/hooks";
import { LOGIN_ROUTE } from "@/features/auth/routes";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isPending, isError } = useCurrentUser();

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.replace(LOGIN_ROUTE);
    }
  }, [isPending, isAuthenticated, isError, router]);

  if (isPending || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin text-gray-400" />
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  return <>{children}</>;
}
