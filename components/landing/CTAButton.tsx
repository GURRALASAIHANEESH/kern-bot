"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";

export default function CTAButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        // Brief intentional delay — makes the transition feel like
        // "connecting to KERN" rather than an instant page swap
        await new Promise((r) => setTimeout(r, 400));
        router.push("/chat");
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <button
                onClick={handleClick}
                disabled={loading}
                className={clsx(
                    // Base
                    "relative px-8 py-3 font-mono text-sm tracking-widest uppercase",
                    "border transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-kern-green focus:ring-offset-2",
                    "focus:ring-offset-kern-bg",
                    // Idle
                    !loading && [
                        "border-kern-green text-kern-green",
                        "hover:bg-kern-green hover:text-kern-bg",
                        "shadow-kern-glow hover:shadow-none",
                    ],
                    // Loading
                    loading && [
                        "border-kern-muted text-kern-muted cursor-not-allowed",
                        "opacity-70",
                    ]
                )}
                aria-label={loading ? "Connecting to KERN..." : "Start a session with KERN"}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-blink text-kern-green">█</span>
                        <span>establishing session...</span>
                    </span>
                ) : (
                    <span>{">"} Start a Session</span>
                )}
            </button>

            {/* Subtle keyboard hint */}
            <p className="text-kern-muted text-[10px] font-mono opacity-50">
                No setup · No account · Just Linux
            </p>
        </div>
    );
}
