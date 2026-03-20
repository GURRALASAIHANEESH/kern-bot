"use client";

import { useChat } from "ai/react";
import { useRef, useState, useCallback } from "react";
import TopicSidebar from "./TopicSidebar";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import SuggestedPrompts from "./SuggestedPrompts";
import { SUGGESTED_PROMPTS } from "@/lib/suggested-prompts";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";

export default function ChatContainer() {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
        setInput,
        reload,
        stop,
    } = useChat({
        api: "/api/chat",
        // Keep UI smooth — don't block on every token
        experimental_throttle: 50,
        onError: (err) => {
            // Log to console in dev, silently fail in prod
            if (process.env.NODE_ENV === "development") {
                console.error("[KERN Chat Error]", err);
            }
        },
    });

    // Inject a prompt directly and submit — used by sidebar + suggested prompts
    const handlePromptSelect = useCallback(
        (prompt: string) => {
            setInput(prompt);
            setSidebarOpen(false);
            // Wait one tick for input state to flush before submitting
            setTimeout(() => formRef.current?.requestSubmit(), 30);
        },
        [setInput]
    );

    const hasMessages = messages.length > 0;

    return (
        <div className="h-full flex overflow-hidden relative">

            {/* ── Mobile sidebar overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/60 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={clsx(
                    // Base
                    "z-30 flex flex-col w-56 shrink-0",
                    "border-r border-kern-border bg-kern-surface",
                    // Mobile: fixed drawer
                    "fixed inset-y-0 left-0 transition-transform duration-200 ease-in-out",
                    "md:relative md:translate-x-0 md:inset-auto",
                    // Mobile open/close
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
                aria-label="Topic navigation"
            >
                {/* Mobile close button */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-kern-border md:hidden">
                    <span className="text-kern-green text-xs font-semibold uppercase tracking-wider">
                        Topics
                    </span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-kern-muted hover:text-kern-green transition-colors p-1"
                        aria-label="Close sidebar"
                    >
                        <X size={14} />
                    </button>
                </div>

                <TopicSidebar onPromptClick={handlePromptSelect} />
            </aside>

            {/* ── Main chat panel ── */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Mobile header bar with menu toggle */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-kern-border md:hidden shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-kern-muted hover:text-kern-green transition-colors p-1"
                        aria-label="Open topic navigation"
                    >
                        <Menu size={16} />
                    </button>
                    <span className="text-kern-muted text-xs font-mono">
                        kern / linux-mentor
                    </span>
                </div>

                {/* Message area */}
                <MessageList
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                    onRetry={reload}
                />

                {/* Suggested prompts — only shown before first message */}
                {!hasMessages && (
                    <div className="px-4 pb-3 shrink-0">
                        <SuggestedPrompts
                            prompts={SUGGESTED_PROMPTS.slice(0, 6)}
                            onSelect={handlePromptSelect}
                        />
                    </div>
                )}

                {/* Input bar */}
                <InputBar
                    input={input}
                    isLoading={isLoading}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onStop={stop}
                    formRef={formRef}
                />
            </div>
        </div>
    );
}
