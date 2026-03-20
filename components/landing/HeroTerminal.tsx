"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/ui/TerminalWindow";
import { clsx } from "clsx";

// The text KERN "types" into the terminal on the landing page
const KERN_INTRO = `You just connected to a specialist.

Shell scripting. Kernel internals.
Process trees. Network stacks.
Broken deploys. Midnight OOM kills.
systemd units that refuse to stay up.

This is the layer most engineers treat as a black box.
It's where I'm most at home.

Bring me something real.
What are you debugging?`;

// Typewriter hook — streams text character by character
function useTypewriter(text: string, speedMs = 18) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        setDisplayed("");
        setDone(false);
        let i = 0;

        const interval = setInterval(() => {
            if (i >= text.length) {
                setDone(true);
                clearInterval(interval);
                return;
            }
            setDisplayed(text.slice(0, i + 1));
            i++;
        }, speedMs);

        return () => clearInterval(interval);
    }, [text, speedMs]);

    return { displayed, done };
}

export default function HeroTerminal() {
    const { displayed, done } = useTypewriter(KERN_INTRO, 16);

    return (
        <TerminalWindow
            title="kern@linux:~ — session-0"
            subtitle="interactive"
            className="w-full"
        >
            <div className="min-h-[200px]">
                {/* Prompt line */}
                <div className="flex gap-2 mb-3">
                    <span className="text-kern-green text-xs font-mono shrink-0">
                        kern@linux:~$
                    </span>
                    <span className="text-kern-muted text-xs font-mono">
                        initialize --mode=interactive
                    </span>
                </div>

                {/* Typewriter output */}
                <pre
                    className={clsx(
                        "text-xs font-mono leading-relaxed",
                        "text-kern-text whitespace-pre-wrap"
                    )}
                    aria-live="polite"
                    aria-label="KERN introduction"
                >
                    {displayed}
                    {/* Blinking cursor — shown while typing and after */}
                    <span
                        className={clsx(
                            "text-kern-green",
                            done ? "animate-blink" : ""
                        )}
                        aria-hidden="true"
                    >
                        █
                    </span>
                </pre>
            </div>
        </TerminalWindow>
    );
}
