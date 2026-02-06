"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuItem as SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, MoreHorizontal, Pin, PinOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Route = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  link: string;
  className?: string;
  isPinned?: boolean;
  subs?: {
    title: string;
    link: string;
    icon?: React.ReactNode;
  }[];
};

export default function DashboardNavigation({
  routes,
  onPinAction,
  onDeleteAction
}: {
  routes: Route[];
  onPinAction?: (id: string) => void;
  onDeleteAction?: (id: string) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state } = useSidebar();

  const currentPath = useMemo(() => {
    const id = searchParams.get("id");
    return pathname + (id ? `?id=${id}` : "");
  }, [pathname, searchParams]);

  const isCollapsed = state === "collapsed";
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  // Sort routes: Pinned first, then New Chat, then others
  const sortedRoutes = useMemo(() => {
    const newChat = routes.find(r => r.id === "new-chat");
    const otherChats = routes.filter(r => r.id !== "new-chat");

    return [
      ...(newChat ? [newChat] : []),
      ...otherChats.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      })
    ];
  }, [routes]);

  // Effect to open collapsible if an active sub-route is found on initial load
  useMemo(() => {
    for (const route of sortedRoutes) {
      if (route.subs?.some((sub) => sub.link === currentPath)) {
        setOpenCollapsible(route.id);
        break;
      }
    }
  }, [sortedRoutes, currentPath]);

  return (
    <SidebarMenu className="gap-1">
      {sortedRoutes.map((route) => {
        const isActive = route.link === currentPath;
        const hasSubRoutes = !!route.subs?.length;
        const isSubRouteActive = route.subs?.some(
          (sub) => sub.link === currentPath
        );
        const isOpen =
          !isCollapsed && (openCollapsible === route.id || isSubRouteActive);

        return (
          <SidebarMenuItem key={route.id} className="group/item relative">
            {hasSubRoutes ? (
              <Collapsible
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenCollapsible(open ? route.id : null)
                }
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      "flex w-full items-center rounded-lg px-2 transition-colors",
                      isActive || isSubRouteActive
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground hover:bg-sidebar-muted hover:text-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    {route.icon}
                    {!isCollapsed && (
                      <span className="ml-2 flex-1 text-sm font-medium">
                        {route.title}
                      </span>
                    )}
                    {!isCollapsed && hasSubRoutes && (
                      <span className="ml-auto">
                        {isOpen ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </span>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {!isCollapsed && (
                  <CollapsibleContent>
                    <SidebarMenuSub className="my-1 ml-3.5 ">
                      {route.subs?.map((subRoute) => (
                        <SidebarMenuSubItem
                          key={`${route.id}-${subRoute.title}`}
                          className="h-auto"
                        >
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subRoute.link}
                              prefetch={true}
                              className={cn(
                                "flex items-center rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                                subRoute.link === currentPath
                                  ? "text-primary font-bold bg-primary/5"
                                  : "text-muted-foreground hover:bg-sidebar-muted hover:text-foreground"
                              )}
                            >
                              {subRoute.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            ) : (
              <div className="flex items-center w-full">
                <SidebarMenuButton tooltip={route.title} asChild className={cn(route.className, "flex-1")}>
                  <Link
                    href={route.link}
                    prefetch={true}
                    className={cn(
                      "flex items-center rounded-lg px-2 transition-colors",
                      isActive
                        ? route.id === "new-chat"
                          ? "text-primary font-bold" // Subtle for new chat
                          : "bg-primary text-primary-foreground font-bold shadow-sm" // Standard active
                        : route.id === "new-chat"
                          ? "text-muted-foreground" // No hover for new chat
                          : "text-muted-foreground hover:bg-sidebar-muted hover:text-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    {route.icon}
                    {!isCollapsed && (
                      <span className="ml-2 text-sm font-medium flex-1 truncate">
                        {route.title}
                      </span>
                    )}
                    {!isCollapsed && route.isPinned && (
                      <Pin className="size-3 ml-auto text-primary fill-primary opacity-70" />
                    )}
                  </Link>
                </SidebarMenuButton>

                {!isCollapsed && route.id !== "new-chat" && (
                  <div className="absolute right-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onPinAction?.(route.id)}>
                          {route.isPinned ? <PinOff className="mr-2 size-4" /> : <Pin className="mr-2 size-4" />}
                          <span>{route.isPinned ? "Unpin" : "Pin chat"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDeleteAction?.(route.id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          <span>Delete chat</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
