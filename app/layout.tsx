import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeToggle } from "../components/ThemeToggle";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "14",
  description: "A simple real-time poll",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
        suppressHydrationWarning
      >
        <Script
          strategy="lazyOnload"
          src="https://cloud.umami.is/script.js"
          data-website-id="6c8e912d-21fb-45e2-b511-2469725007f6"
        />
        <ThemeProvider>
          {/* Background Gradient Pattern */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
            <div
              className="absolute inset-0 transition-opacity duration-1000 dark:hidden"
              style={{
                background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
                willChange: "transform",
              }}
            />
            <div
              className="absolute inset-0 hidden transition-opacity duration-1000 dark:block"
              style={{
                background: "radial-gradient(125% 125% at 50% 10%, #020617 40%, #1e293b 100%)",
                willChange: "transform",
              }}
            />
          </div>
          <ConvexClientProvider>
            {children}
            <Toaster position="top-center" richColors />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
