"use client";

import { useState } from "react";
import { SUGGESTED_PROMPTS } from "@/lib/suggested-prompts";
import { CATEGORIES } from "@/lib/knowledge-base";
import { ChevronDown, ChevronRight, Hash } from "lucide-react";
import { clsx } from "clsx";

interface TopicSidebarProps {
    onPromptClick: (prompt: string) => void;
}

// Category accent colors — subtle tint per topic
const CATEGORY_COLORS: Record<string, string> = {
    Shell: "text-kern-green",
    Kernel: "text-kern-amber",
    Networking: "text-blue-400",
    Filesystem: "text-purple-400",
    SystemD: "text-cyan-400",
    Observability: "text-orange-400",
    Security: "text-kern-error",
};

export default function TopicSidebar({ onPromptClick }: TopicSidebarProps) {
    // Default open first category
    const [openCategory, setOpenCategory] = useState<string | null>(CATEGORIES[0]);

    function toggleCategory(cat: string) {
        setOpenCategory((prev) => (prev === cat ? null : cat));
    }

    return (
        <div className="flex-1 overflow-y-auto py-2" role="navigation" aria-label="Topic categories">

            {/* Section header */}
            <div className="px-3 py-2 border-b border-kern-border mb-1">
                <p className="text-kern-muted text-[10px] font-mono uppercase tracking-widest">
                    Knowledge Base
                </p>
            </div>

            {CATEGORIES.map((cat) => {
                const prompts = SUGGESTED_PROMPTS.filter((p) => p.category === cat);
                const isOpen = openCategory === cat;
                const colorClass = CATEGORY_COLORS[cat] ?? "text-kern-muted";

                return (
                    <div key={cat}>
                        {/* Category toggle button */}
                        <button
                            onClick={() => toggleCategory(cat)}
                            aria-expanded={isOpen}
                            aria-controls={`sidebar-${cat}`}
                            className={clsx(
                                "w-full flex items-center justify-between",
                                "px-3 py-2 text-xs font-mono",
                                "hover:bg-kern-border/30 transition-colors duration-100",
                                "focus:outline-none focus:bg-kern-border/30",
                                "group"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Hash
                                    size={10}
                                    className={clsx(colorClass, "opacity-70")}
                                    aria-hidden="true"
                                />
                                <span
                                    className={clsx(
                                        "transition-colors duration-100",
                                        isOpen ? colorClass : "text-kern-muted group-hover:text-kern-text"
                                    )}
                                >
                                    {cat}
                                </span>
                                {/* Prompt count badge */}
                                <span className="text-kern-muted text-[10px] opacity-50">
                                    {prompts.length}
                                </span>
                            </div>
                            {isOpen ? (
                                <ChevronDown size={11} className="text-kern-muted" aria-hidden="true" />
                            ) : (
                                <ChevronRight size={11} className="text-kern-muted" aria-hidden="true" />
                            )}
                        </button>

                        {/* Prompt list — animated open/close */}
                        {isOpen && (
                            <div
                                id={`sidebar-${cat}`}
                                role="list"
                                className="border-l border-kern-border ml-5 mb-1 animate-fade-in"
                            >
                                {prompts.map((p) => (
                                    <button
                                        key={p.id}
                                        role="listitem"
                                        onClick={() => onPromptClick(p.prompt)}
                                        className={clsx(
                                            "w-full text-left",
                                            "px-3 py-1.5 text-[11px] font-mono",
                                            "text-kern-muted hover:text-kern-text",
                                            "hover:bg-kern-border/20 transition-colors duration-100",
                                            "focus:outline-none focus:bg-kern-border/20",
                                            "flex items-center gap-1.5 group/item"
                                        )}
                                    >
                                        <span
                                            className={clsx(
                                                "shrink-0 opacity-0 group-hover/item:opacity-100",
                                                "transition-opacity duration-100",
                                                colorClass
                                            )}
                                            aria-hidden="true"
                                        >
                                            {">"}
                                        </span>
                                        <span className="truncate leading-relaxed">{p.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Footer — version tag */}
            <div className="px-3 pt-4 pb-2 mt-auto">
                <p className="text-kern-muted text-[10px] font-mono opacity-40">
                    kern v2.6.39-lts
                </p>
                <p className="text-kern-muted text-[10px] font-mono opacity-30">
                    linux-only scope
                </p>
            </div>
        </div>
    );
}
