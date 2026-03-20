"use client";

import { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";

interface BootLine {
    status: "OK" | "WARN" | "INFO";
    text: string;
    delayMs: number;
}

const BOOT_LINES: BootLine[] = [
    { status: "OK", text: "Initializing Linux knowledge graph", delayMs: 0 },
    { status: "OK", text: "Calibrating precision response engine", delayMs: 320 },
    { status: "OK", text: "Shell · Kernel · Networking · Filesystem · SystemD · Sec", delayMs: 580 },
    { status: "OK", text: "160+ domain patterns indexed and ready", delayMs: 860 },
    { status: "OK", text: "Scope lock: Linux systems only", delayMs: 1100 },
    { status: "OK", text: "Streaming interface armed", delayMs: 1340 },
    { status: "INFO", text: "Session ready. The terminal is listening.", delayMs: 1600 },
];


const STATUS_STYLES = {
    OK: "text-kern-green",
    WARN: "text-kern-amber",
    INFO: "text-kern-muted",
};

const STATUS_LABELS = {
    OK: "  OK  ",
    WARN: " WARN ",
    INFO: " INFO ",
};

export default function BootSequence() {
    const [visibleCount, setVisibleCount] = useState(0);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        // Schedule each line to appear after its delay
        BOOT_LINES.forEach((line, i) => {
            const t = setTimeout(() => {
                setVisibleCount((v) => Math.max(v, i + 1));
            }, line.delayMs);
            timersRef.current.push(t);
        });

        return () => {
            timersRef.current.forEach(clearTimeout);
        };
    }, []);

    return (
        <div
            className="w-full space-y-0.5"
            role="status"
            aria-label="KERN boot sequence"
            aria-live="polite"
        >
            {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
                <div
                    key={i}
                    className="flex items-start gap-2 text-xs font-mono animate-boot"
                    style={{ animationFillMode: "both" }}
                >
                    {/* Status badge */}
                    <span
                        className={clsx(
                            "shrink-0 border px-1 py-0.5 text-[10px] leading-none",
                            line.status === "OK" && "border-kern-green/40 text-kern-green bg-kern-greenMute",
                            line.status === "WARN" && "border-kern-amber/40 text-kern-amber bg-kern-amber/10",
                            line.status === "INFO" && "border-kern-border text-kern-muted"
                        )}
                        aria-label={line.status}
                    >
                        {STATUS_LABELS[line.status]}
                    </span>

                    {/* Line text */}
                    <span
                        className={clsx(
                            "leading-relaxed",
                            STATUS_STYLES[line.status],
                            // Last line gets a slight highlight
                            i === BOOT_LINES.length - 1 && "font-semibold"
                        )}
                    >
                        {line.text}
                    </span>
                </div>
            ))}

            {/* Blinking cursor after last visible line */}
            {visibleCount > 0 && visibleCount < BOOT_LINES.length && (
                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-kern-muted opacity-0 text-[10px]">{"      "}</span>
                    <span className="text-kern-green animate-blink">█</span>
                </div>
            )}
        </div>
    );
}
