"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn, getOrCreateVoterId } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Settings,
} from "lucide-react";
import type { Route } from "./nav-main";
import DashboardNavigation from "@/components/sidebar-02/nav-main";
import { TeamSwitcher } from "@/components/sidebar-02/team-switcher";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Facehash } from "facehash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, MoreHorizontal, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [voterId, setVoterId] = useState("");

  useEffect(() => {
    setVoterId(getOrCreateVoterId());
  }, []);

  const profile = useQuery(api.profiles.getProfile, voterId ? { voterId } : "skip");
  const chats = useQuery((api as any).chats.list, voterId ? { voterId } : "skip");
  const togglePin = useMutation((api as any).chats.togglePin);
  const deleteChat = useMutation((api as any).chats.remove);

  const chatRoutes: Route[] = [
    {
      id: "new-chat",
      title: "Start a new chat",
      icon: <Plus className="size-4 text-primary" />,
      link: "/chat",
      className: "group-hover:text-primary",
    },
    ...(chats?.map((chat: any) => ({
      id: chat._id,
      title: chat.title,
      icon: <MessageSquare className="size-4" />,
      link: `/chat?id=${chat._id}`,
      isPinned: chat.isPinned,
    })) || []),
  ];

  const settingsRoutes: Route[] = [
    {
      id: "settings",
      title: "Settings",
      icon: <Settings className="size-4" />,
      link: "#",
    },
  ];

  const router = useRouter();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-border/50">
            <Image
              src="/favicon.png"
              alt="14 Logo"
              fill
              className="object-cover"
            />
          </div>
          {!isCollapsed && (
            <span className="font-serif font-bold text-xl tracking-tight text-white dark:text-white">
              14
            </span>
          )}
        </Link>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-2 px-2 py-4">
        <DashboardNavigation
          routes={chatRoutes}
          onPinAction={(id) => togglePin({ chatId: id })}
          onDeleteAction={(id) => {
            if (confirm("Are you sure you want to delete this chat?")) {
              deleteChat({ chatId: id });
              if (window.location.search.includes(id)) {
                router.push("/chat");
              }
            }
          }}
        />
      </SidebarContent>
      <SidebarFooter className="p-2 bg-muted/30 rounded-t-2xl border-t border-border/40">
        {profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 p-2 rounded-xl group transition-all hover:bg-muted/50 text-left">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border/50 group-hover:border-primary/50 transition-colors">
                  {profile.imageUrl ? (
                    <Image src={profile.imageUrl} alt={profile.fullName} fill className="object-cover" />
                  ) : (
                    <Facehash name={profile.fullName} size={32} colors={["#87B1F9", "#CBDCFE", "#1E40AF"]} interactive />
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Your Crush</span>
                      <span className="text-sm font-serif font-bold text-foreground leading-none group-hover:text-primary transition-colors truncate">
                        {profile.fullName}
                      </span>
                    </div>
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="center"
              className="w-[200px] mb-2"
            >
              <DropdownMenuItem onClick={() => router.push("/")}>
                <User className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  localStorage.removeItem("voterId");
                  window.location.href = "/";
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="h-12 w-full animate-pulse bg-muted rounded-xl" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
