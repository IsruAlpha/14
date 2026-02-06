"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationBellProps {
    count: number;
    onClick?: () => void;
    className?: string;
}

export function NotificationBell({ count, onClick, className }: NotificationBellProps) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn(
                "relative h-10 w-10 rounded-xl hover:bg-muted/50 active:scale-95 transition-all text-foreground/70 hover:text-foreground",
                className
            )}
        >
            <Bell className="h-5 w-5" />
            <AnimatePresence>
                {count > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white shadow-lg border-2 border-background"
                    >
                        {count > 99 ? "99+" : count}
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    );
}
