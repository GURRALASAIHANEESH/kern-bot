"use client";

import { useRef, useEffect, useCallback } from "react";
import { Message } from "ai";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { AlertTriangle, RefreshCw, Terminal } from "lucide-react";
import { clsx } from "clsx";

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    error: Error | undefined;
    onRetry: () => void;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center select-none">
            {/* Icon */}
            <div
                className={clsx(
                    "w-14 h-14 rounded-full",
                    "border border-kern-green/40",
                    "flex items-center justify-center",
                    "shadow-kern-glow"
                )}
                aria-hidden="true"
            >
                <Terminal size={22} className="text-kern-green opacity-80" />
            </div>

            {/* Heading */}
            <div className="space-y-1.5">
                <p className="text-kern-green font-semibold text-sm tracking-wide">
                    KERN is ready.
                </p>
                <p className="text-kern-muted text-xs max-w-xs leading-relaxed">
                    Ask anything about Linux, shell scripting, kernel internals,
                    networking, systemd, or observability.
                </p>
            </div>

            {/* Scope chips */}
            <div className="flex flex-wrap justify-center gap-1.5 max-w-sm">
                {["Shell", "Kernel", "Networking", "Filesystem", "SystemD", "Observability", "Security"].map(
                    (tag) => (
                        <span
                            key={tag}
                            className={clsx(
                                "px-2 py-0.5 rounded text-[10px] font-mono",
                                "border border-kern-border text-kern-muted"
                            )}
                        >
                            {tag}
                        </span>
                    )
                )}
            </div>
        </div>
    );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="px-4 py-2 shrink-0">
            <div
                className={clsx(
                    "flex items-start gap-3 rounded-md px-4 py-3",
                    "border border-kern-error/40 bg-kern-error/5"
                )}
                role="alert"
                aria-live="assertive"
            >
                <AlertTriangle
                    size={14}
                    className="text-kern-error mt-0.5 shrink-0"
                    aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-kern-error text-xs font-semibold mb-0.5">
                        Kernel panic — connection failed
                    </p>
                    <p className="text-kern-muted text-xs leading-relaxed">
                        Check your API key configuration or network connection.
                    </p>
                </div>
                <button
                    onClick={onRetry}
                    className={clsx(
                        "flex items-center gap-1.5 shrink-0",
                        "text-kern-muted hover:text-kern-green",
                        "text-xs font-mono transition-colors"
                    )}
                    aria-label="Retry last message"
                >
                    <RefreshCw size={12} />
                    <span>retry</span>
                </button>
            </div>
        </div>
    );
}

// ─── Message List ─────────────────────────────────────────────────────────────

export default function MessageList({
    messages,
    isLoading,
    error,
    onRetry,
}: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isNearBottomRef = useRef(true);

    // Track whether user has scrolled up — if so, don't auto-scroll
    const handleScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        isNearBottomRef.current = distanceFromBottom < 80;
    }, []);

    // Auto-scroll only when user is near the bottom
    useEffect(() => {
        if (isNearBottomRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    // Always scroll to bottom when a new conversation starts
    useEffect(() => {
        if (messages.length === 1) {
            bottomRef.current?.scrollIntoView({ behavior: "instant" });
            isNearBottomRef.current = true;
        }
    }, [messages.length]);

    if (messages.length === 0 && !isLoading) {
        return (
            <>
                <EmptyState />
                {error && <ErrorState onRetry={onRetry} />}
            </>
        );
    }

    return (
        <>
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className={clsx(
                    "flex-1 overflow-y-auto",
                    "px-4 py-5 space-y-5",
                    "scroll-smooth"
                )}
                role="log"
                aria-label="Conversation with KERN"
                aria-live="polite"
            >
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                {/* Typing indicator — shown while KERN is streaming */}
                {isLoading && (
                    <TypingIndicator />
                )}

                {/* Invisible scroll anchor */}
                <div ref={bottomRef} aria-hidden="true" />
            </div>

            {/* Error shown below the message list, above the input */}
            {error && <ErrorState onRetry={onRetry} />}
        </>
    );
}
