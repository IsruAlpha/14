"use client";
import { useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useAutomatedMessages(voterId: string | undefined) {
    const checkAndTrigger = useAction((api as any).automated.checkAndTrigger);

    useEffect(() => {
        if (!voterId) return;

        // Check on mount
        const trigger = async () => {
            try {
                await checkAndTrigger({ voterId });
            } catch (error) {
                console.error("Failed to check automated messages:", error);
            }
        };

        trigger();

        // Check every 30 minutes
        const interval = setInterval(trigger, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, [voterId, checkAndTrigger]);
}
