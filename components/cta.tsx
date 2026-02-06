"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";



interface CallToActionProps {
  voted: boolean;
  onGetStarted: () => void;
}

const CrushDecoration = () => (
  <svg
    width="44"
    height="40"
    viewBox="0 0 44 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -bottom-4 -left-2 w-12 h-12 pointer-events-none text-foreground"
  >
    <path
      d="M2.5 37.5L41.5 2.5"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M2.5 19.5L25.5 2.5"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export function CallToAction({ voted, onGetStarted }: CallToActionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false); // Reset to false and then true to ensure clean re-mount
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-y-12 px-8 py-16 md:px-12 md:py-24">
      {/* Corner Plus Icons */}
      <PlusIcon
        className="absolute left-[-12px] top-[-12px] size-6 text-muted-foreground/40"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute right-[-12px] top-[-12px] size-6 text-muted-foreground/40"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute bottom-[-12px] left-[-12px] size-6 text-muted-foreground/40"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute bottom-[-12px] right-[-12px] size-6 text-muted-foreground/40"
        strokeWidth={1}
        aria-hidden
      />

      <div className="space-y-4">
        <h1 className="text-center text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-7xl font-serif">
          Talk to your{" "}
          <span className="relative inline-block">
            crush
            <CrushDecoration />
          </span>
        </h1>

        <p className="mx-auto max-w-lg text-balance text-center text-sm font-medium text-muted-foreground md:text-base">
          Created with 🍩 by{" "}
          <a
            href="https://israelfirew.co"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
          >
            Israel
          </a>
        </p>
      </div>

      {/* Main CTA Block */}
      <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between border-x md:flex-row bg-background/50 backdrop-blur-sm shadow-xl">
        <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />
        <div className="border-b p-4 md:border-b-0 flex items-center justify-center md:justify-start flex-1">
          <h2 className="text-center font-bold text-lg md:text-left md:text-2xl tracking-tight">
            Shoot Your Shot. ( Safely )
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2 p-4 md:border-l">
          <Button variant="secondary" asChild className="rounded-none border-foreground/10">
            <a href="https://israelfirew.co" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
          </Button>
          <Button onClick={onGetStarted} className="rounded-none px-8">
            Get Started
          </Button>
        </div>
        <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
      </div>

      {/* Background Illustration / Decoration */}
      <div className="flex w-full justify-center opacity-70 transition-all hover:opacity-90 dark:brightness-90">
        <img
          src="/launch-illustration.png"
          alt="Launch Celebration"
          className="h-auto w-full max-w-sm object-contain"
        />
      </div>
    </section>
  );
}

