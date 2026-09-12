"use client";

import { useRouter } from "next/navigation";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "@/features/auth/hooks";
import { LOGIN_ROUTE } from "@/features/auth/routes";
import { toast } from "@/lib/toast";

export default function AppPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const onLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.replace(LOGIN_ROUTE);
        router.refresh();
      },
      onError: (error) => {
        toast.apiError(error, "Unable to sign out right now.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
        <Logo />
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          disabled={logout.isPending}
        >
          {logout.isPending ? "Signing out" : "Sign out"}
        </Button>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-h1 font-semibold text-ink">Your workspace</h1>
        <p className="mt-2 text-body text-gray-600">
          Signed in as {user?.email}
        </p>
      </main>
    </div>
  );
}
