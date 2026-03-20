"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

// Cycles through realistic-feeling "thinking" states
// Makes the wait feel intentional, not just a spinner
const THINKING_STATES = [
    "parsing query",
    "retrieving context",
    "processing",
    "composing response",
];

const STATE_DURATIONS = [600, 800, 400, 0]; // ms per state, 0 = stay on last

export default function TypingIndicator() {
    const [stateIndex, setStateIndex] = useState(0);

    useEffect(() => {
        if (stateIndex >= THINKING_STATES.length - 1) return;

        const timer = setTimeout(() => {
            setStateIndex((i) => i + 1);
        }, STATE_DURATIONS[stateIndex]);

        return () => clearTimeout(timer);
    }, [stateIndex]);

    return (
        <div
            className="flex gap-3 animate-fade-in"
            role="status"
            aria-label="KERN is generating a response"
        >
            {/* Avatar */}
            <div
                className={clsx(
                    "w-7 h-7 shrink-0 mt-0.5",
                    "rounded border border-kern-green",
                    "flex items-center justify-center",
                    "shadow-kern-glow"
                )}
                aria-hidden="true"
            >
                <span className="text-kern-green text-xs font-bold leading-none">K</span>
            </div>

            {/* Thinking state */}
            <div className="flex items-center gap-2 py-1.5">
                {/* Three dot pulse — staggered */}
                <div className="flex items-center gap-1" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-1 h-1 rounded-full bg-kern-green"
                            style={{
                                animation: "blink 1.2s ease-in-out infinite",
                                animationDelay: `${i * 0.2}s`,
                            }}
                        />
                    ))}
                </div>

                {/* State label */}
                <span
                    key={stateIndex}
                    className="text-kern-muted text-xs font-mono animate-fade-in"
                >
                    {THINKING_STATES[stateIndex]}
                    <span
                        className="animate-blink ml-0.5 text-kern-green"
                        aria-hidden="true"
                    >
                        █
                    </span>
                </span>
            </div>
        </div>
    );
}
