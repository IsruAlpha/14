"use client";

import { NextThemeProvider } from "@space-man/react-theme-animation";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <NextThemeProvider
            defaultTheme="system"
            defaultColorTheme="default"
            colorThemes={["default", "blue", "green"]}
        >
            {children}
        </NextThemeProvider>
    );
}
