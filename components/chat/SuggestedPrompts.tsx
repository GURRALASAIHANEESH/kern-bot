"use client";

import { useState } from "react";
import { SuggestedPrompt, SUGGESTED_PROMPTS } from "@/lib/suggested-prompts";
import { CATEGORIES } from "@/lib/knowledge-base";
import { clsx } from "clsx";

interface SuggestedPromptsProps {
    prompts: SuggestedPrompt[];
    onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({
    prompts,
    onSelect,
}: SuggestedPromptsProps) {
    const [activeCategory, setActiveCategory] = useState<string>("Shell");

    // Filter prompts by active category from full list
    const filtered = SUGGESTED_PROMPTS.filter(
        (p) => p.category === activeCategory
    ).slice(0, 4);

    return (
        <div className="space-y-2.5">
            {/* Section label */}
            <p className="text-kern-muted text-[10px] font-mono uppercase tracking-widest px-0.5">
                Quick start — pick a topic
            </p>

            {/* Category tabs */}
            <div
                className="flex gap-1.5 flex-wrap"
                role="tablist"
                aria-label="Topic categories"
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        role="tab"
                        aria-selected={activeCategory === cat}
                        onClick={() => setActiveCategory(cat)}
                        className={clsx(
                            "px-2.5 py-1 rounded text-[11px] font-mono",
                            "border transition-all duration-150",
                            "focus:outline-none focus:ring-1 focus:ring-kern-green",
                            activeCategory === cat
                                ? "border-kern-green text-kern-green bg-kern-greenMute"
                                : "border-kern-border text-kern-muted hover:border-kern-green/40 hover:text-kern-text"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Prompt pills for active category */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-1.5"
                role="tabpanel"
                aria-label={`${activeCategory} prompts`}
            >
                {filtered.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => onSelect(p.prompt)}
                        className={clsx(
                            "text-left px-3 py-2 rounded",
                            "border border-kern-border",
                            "text-kern-muted text-xs font-mono",
                            "hover:border-kern-green/50 hover:text-kern-text hover:bg-kern-surface",
                            "transition-all duration-150",
                            "focus:outline-none focus:ring-1 focus:ring-kern-green",
                            "group flex items-start gap-2"
                        )}
                    >
                        <span
                            className="text-kern-green shrink-0 group-hover:text-kern-greenDim transition-colors"
                            aria-hidden="true"
                        >
                            {">"}
                        </span>
                        <span className="leading-relaxed">{p.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
