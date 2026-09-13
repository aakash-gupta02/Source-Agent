"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AuthUserDto } from "@repo/shared/types";
import {
  BotIcon,
  BrainCircuit,
  ChevronDownIcon,
  DatabaseIcon,
  MessageSquareIcon,
  SquarePenIcon,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { SidebarBrand } from "@/components/sidebar-brand";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useConversations } from "@/features/conversation/hooks";
import {
  AI_PROVIDERS_ROUTE,
  APP_ROUTE,
  conversationRoute,
  DATABASE_CONNECTIONS_ROUTE,
} from "@/features/auth/routes";

const primaryItems = [
  {
    title: "New chat",
    href: APP_ROUTE,
    icon: SquarePenIcon,
  },
  {
    title: "AI providers",
    href: AI_PROVIDERS_ROUTE,
    icon: BrainCircuit,
  },
  {
    title: "Database connections",
    href: DATABASE_CONNECTIONS_ROUTE,
    icon: DatabaseIcon,
  },
] as const;

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: AuthUserDto;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const conversations = useConversations();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroup className="shrink-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    tooltip={item.title}
                    isActive={pathname === item.href}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Collapsible
          defaultOpen
          className="group/conversations flex min-h-0 flex-1 flex-col group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroup className="flex min-h-0 flex-1 flex-col pt-0">
            <CollapsibleTrigger className="flex h-8 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent">
              <span>Conversations</span>
              <ChevronDownIcon className="ml-auto size-3.5 transition-transform group-data-closed/conversations:-rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="min-h-0 flex-1">
              <SidebarGroupContent className="h-full overflow-y-auto pt-1">
                <SidebarMenu>
                  {conversations.isPending
                    ? Array.from({ length: 4 }, (_, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuSkeleton showIcon />
                        </SidebarMenuItem>
                      ))
                    : null}

                  {conversations.isError ? (
                    <li className="px-3 py-2 text-xs text-muted-foreground">
                      Could not load conversations.
                    </li>
                  ) : null}

                  {conversations.data?.length === 0 ? (
                    <li className="px-3 py-2 text-xs text-muted-foreground">
                      No conversations yet.
                    </li>
                  ) : null}

                  {conversations.data?.map((conversation) => {
                    const href = conversationRoute(conversation.id);

                    return (
                      <SidebarMenuItem key={conversation.id}>
                        <SidebarMenuButton
                          render={<Link href={href} />}
                          isActive={pathname === href}
                          tooltip={conversation.title ?? "New conversation"}
                        >
                          <MessageSquareIcon />
                          <span>
                            {conversation.title ?? "New conversation"}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
