"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

const FEB_14 = new Date(new Date().getFullYear(), 1, 14, 0, 0, 0, 0);

function getTimeLeft() {
  const now = new Date();
  const target =
    FEB_14.getTime() <= now.getTime()
      ? new Date(now.getFullYear() + 1, 1, 14, 0, 0, 0, 0)
      : FEB_14;
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function CallToAction() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!mounted) return null;

  const parts = [
    { value: timeLeft.days, label: "DAYS" },
    { value: timeLeft.hours, label: "HOURS" },
    { value: timeLeft.minutes, label: "MINUTES" },
    { value: timeLeft.seconds, label: "SECONDS" },
  ] as const;

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
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Everyone will know. &quot;Statistically&quot;
        </h2>

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
      <div className="flex w-full items-center justify-center gap-2 sm:gap-4">
        {parts.map(({ value, label }) => (
          <div
            key={label}
            className="group flex flex-1 flex-col items-center justify-center rounded-2xl border border-border/40 bg-card/30 px-3 py-4 backdrop-blur-sm transition-all hover:bg-card/50 sm:px-6 sm:py-6"
          >
            <span className="text-2xl font-black tabular-nums text-foreground sm:text-4xl md:text-5xl">
              {String(value).padStart(2, "0")}
            </span>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
