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
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ] as const;

  return (
    <section
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-y-4 px-4 py-6 sm:gap-y-6 sm:px-6 sm:py-8 md:px-8"
      style={{ backgroundColor: "#F5F2F0", borderTop: "1px solid rgba(196, 191, 184, 0.6)", borderBottom: "1px solid rgba(196, 191, 184, 0.6)" }}
    >
      <PlusIcon
        className="absolute left-2 top-2 size-4 text-[#6b6b6b] sm:left-4 sm:top-4 sm:size-5 md:left-6 md:top-4 md:size-6"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute right-2 top-2 size-4 text-[#6b6b6b] sm:right-4 sm:top-4 sm:size-5 md:right-6 md:top-4 md:size-6"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute bottom-2 left-2 size-4 text-[#6b6b6b] sm:bottom-4 sm:left-4 sm:size-5 md:bottom-4 md:left-6 md:size-6"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute bottom-2 right-2 size-4 text-[#6b6b6b] sm:bottom-4 sm:right-4 sm:size-5 md:bottom-4 md:right-6 md:size-6"
        strokeWidth={1}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-px border-l border-[#c4bfb8]/50 md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-px border-r border-[#c4bfb8]/50 md:block" />
      <div className="-z-10 absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 border-l border-dashed border-[#c4bfb8]/40 md:block" />

      <h2 className="text-center text-lg font-semibold leading-tight text-[#60647B] sm:text-xl md:text-2xl lg:text-3xl">
        Everyone will know. &quot;Statistically&quot;
      </h2>
      <p className="text-balance text-center text-xs font-medium text-[#60647B] sm:text-sm md:text-base">
        Wait on our{" "}
        <a
          href="https://t.me/day_dreamers1"
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto underline underline-offset-2"
        >
          channel
        </a>{" "}
        for the launch
      </p>

      <div className="grid w-full grid-cols-4 gap-2 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3 md:gap-4">
        {parts.map(({ value, label }) => (
          <div
            key={label}
            className="flex min-w-0 flex-col items-center justify-center rounded-lg bg-[#EAE5E0] px-2 py-2.5 sm:min-w-[3.75rem] sm:px-3 sm:py-3 md:min-w-[4.5rem] md:px-4 md:py-3.5 lg:min-w-[5rem] lg:px-5 lg:py-4"
          >
            <span className="text-base font-semibold tabular-nums text-[#2c2c2c] sm:text-xl md:text-2xl lg:text-3xl">
              {String(value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-[#6b6b6b] sm:text-xs md:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
