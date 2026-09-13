"use client";

import type { ReactNode } from "react";
import type { AuthUserDto } from "@repo/shared/types";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
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
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
