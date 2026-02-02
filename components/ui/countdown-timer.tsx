"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAnimate } from "framer-motion";

// Change this date to your target countdown date
const COUNTDOWN_FROM = "2026-02-14T00:00:00";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function ShiftingCountdown() {
    return (
        <section className="flex items-center justify-center p-4">
            <div className="flex w-full max-w-5xl items-center bg-transparent">
                <CountdownItem unit="Day" label="Days" />
                <CountdownItem unit="Hour" label="Hours" />
                <CountdownItem unit="Minute" label="Minutes" />
                <CountdownItem unit="Second" label="Seconds" />
            </div>
        </section>
    );
}

function CountdownItem({ unit, label }: { unit: string; label: string }) {
    const { ref, time } = useTimer(unit);
    // For seconds, ensure two digits (00–59)
    const display = unit === "Second" ? String(time).padStart(2, '0') : time;

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-4 md:gap-2 md:py-8">
            <div className="relative w-full overflow-hidden text-center">
                <span
                    ref={ref}
                    className="block text-3xl font-mono font-semibold dark:text-white text-black md:text-5xl lg:text-7xl transition-colors duration-500"
                >
                    {display}
                </span>
            </div>
            <span className="text-xs font-light dark:text-gray-400 text-gray-500 md:text-base lg:text-lg transition-colors duration-500">
                {label}
            </span>
            <div className="h-px w-full dark:bg-gray-700 bg-gray-300 mt-4 transition-colors duration-500"></div>
        </div>
    );
}

function useTimer(unit: string) {
    const [ref, animate] = useAnimate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeRef = useRef(0);
    const [time, setTime] = useState(0);

    useEffect(() => {
        handleCountdown();
        intervalRef.current = setInterval(handleCountdown, 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCountdown = async () => {
        const end = new Date(COUNTDOWN_FROM).getTime();
        const now = new Date().getTime();
        const distance = end - now;

        let newTime = 0;
        switch (unit) {
            case "Day":
                newTime = Math.max(0, Math.floor(distance / DAY));
                break;
            case "Hour":
                newTime = Math.max(0, Math.floor((distance % DAY) / HOUR));
                break;
            case "Minute":
                newTime = Math.max(0, Math.floor((distance % HOUR) / MINUTE));
                break;
            default:
                newTime = Math.max(0, Math.floor((distance % MINUTE) / SECOND));
        }

        if (newTime !== timeRef.current) {
            // Small optimization: only animate if mounted and ref exists
            if (ref.current) {
                await animate(
                    ref.current,
                    { y: ["0%", "-50%"], opacity: [1, 0] },
                    { duration: 0.35 }
                );

                timeRef.current = newTime;
                setTime(newTime);

                if (ref.current) {
                    await animate(
                        ref.current,
                        { y: ["50%", "0%"], opacity: [0, 1] },
                        { duration: 0.35 }
                    );
                }
            } else {
                timeRef.current = newTime;
                setTime(newTime);
            }
        }
    };

    return { ref, time };
}
