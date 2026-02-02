"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import ShiftingCountdown from "@/components/ui/countdown-timer";


export function CallToAction() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-y-8 px-8 py-16 md:px-12 md:py-24">
      {/* Background Illustration / Decoration */}
      <div className="flex w-full justify-center opacity-90 transition-all hover:opacity-100 dark:brightness-90">
        <img
          src="/launch-illustration.png"
          alt="Launch Celebration"
          className="h-auto w-full max-w-md object-contain"
        />
      </div>
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
          Talk to your crush
        </h1>

        <p className="mx-auto max-w-lg text-balance text-center text-sm font-medium text-muted-foreground md:text-base">
          Wait on our{" "}
          <a
            href="https://t.me/day_dreamers1"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
          >
            channel
          </a>{" "}
          for the launch.
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="w-full">
        <ShiftingCountdown />
      </div>
    </section>
  );
}

