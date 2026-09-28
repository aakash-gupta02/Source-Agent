"use client";

import type { ReactNode } from "react";
import type { AuthUserDto } from "@repo/shared/types";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppLayout({
  children,
  user,
}: {
  children: ReactNode;
  user: AuthUserDto;
}) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="h-svh min-h-0 overflow-hidden">
        <div className="flex shrink-0 items-center border-b px-3 py-2 md:hidden">
          <SidebarTrigger aria-label="Open navigation" />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
