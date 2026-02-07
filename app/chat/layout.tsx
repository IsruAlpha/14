import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/sidebar-02/app-sidebar";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Suspense fallback={<div className="w-[var(--sidebar-width)] h-screen bg-sidebar animate-pulse" />}>
                <DashboardSidebar />
            </Suspense>
            <SidebarInset className="bg-transparent overflow-hidden">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
