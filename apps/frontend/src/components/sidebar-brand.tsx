"use client";

import { PanelLeftIcon } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

/**
 * Wordmark while expanded, brand mark while collapsed. Hovering the collapsed
 * mark swaps it for the toggle, so the rail keeps a single 32px hit target.
 */
export function SidebarBrand() {
  const { state, isMobile, toggleSidebar } = useSidebar();

  if (state === "collapsed" && !isMobile) {
    return (
      <div className="group/brand relative size-8">
        <Logo
          variant="icon"
          className="transition-opacity group-hover/brand:opacity-0"
        />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="absolute inset-0 size-8 opacity-0 transition-opacity group-hover/brand:opacity-100 focus-visible:opacity-100"
        >
          <PanelLeftIcon />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-8 w-full items-center gap-2">
      <Logo variant="text" textClassName="truncate text-base" />
      <SidebarTrigger className="ml-auto" />
    </div>
  );
}
