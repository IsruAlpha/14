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
    <section
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-y-6 px-8 py-10 md:px-12 md:py-12"
      style={{
        backgroundColor: "#fbfbfb93",
        borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* Corner Plus Icons */}
      <PlusIcon
        className="absolute left-[-12px] top-[-12px] size-6 text-gray-500"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute right-[-12px] top-[-12px] size-6 text-gray-500"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute bottom-[-12px] left-[-12px] size-6 text-gray-500"
        strokeWidth={1}
        aria-hidden
      />
      <PlusIcon
        className="absolute bottom-[-12px] right-[-12px] size-6 text-gray-500"
        strokeWidth={1}
        aria-hidden
      />

      {/* Heading */}
      <h2 className="text-center text-2xl font-semibold leading-tight text-gray-700 md:text-3xl lg:text-4xl">
        Everyone will know. &quot;Statistically&quot;
      </h2>

      {/* Subtext */}
      <p className="text-balance text-center text-sm font-medium text-gray-600 md:text-base">
        Wait on our{" "}
        <a
          href="https://t.me/day_dreamers1"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-gray-500 underline-offset-2 transition-colors hover:text-gray-800"
        >
          channel
        </a>{" "}
        for the launch.
      </p>

      {/* Countdown Timer */}
      <div className="flex w-full max-w-2xl items-center justify-center gap-3 md:gap-4">
        {parts.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-1 flex-col items-center justify-center rounded-lg bg-[#D8D8D6] px-4 py-4 shadow-sm md:px-6 md:py-5"
          >
            <span className="text-3xl font-bold tabular-nums text-gray-900 md:text-4xl lg:text-5xl">
              {String(value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-600 md:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
