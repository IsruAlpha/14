"use client";

import { useNextTheme } from "@space-man/react-theme-animation";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, toggleTheme, ref } = useNextTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm" />
        );
    }

    return (
        <button
            ref={ref}
            onClick={() => toggleTheme()}
            className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
        >
            <div className="relative h-5 w-5">
                <Sun className="absolute inset-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
