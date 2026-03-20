"use client";

import { RefObject, KeyboardEvent, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { clsx } from "clsx";

interface InputBarProps {
    input: string;
    isLoading: boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onStop: () => void;
    formRef: RefObject<HTMLFormElement | null>;
}

export default function InputBar({
    input,
    isLoading,
    onChange,
    onSubmit,
    onStop,
    formRef,
}: InputBarProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea as user types — max 6 lines
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
    }, [input]);

    // Focus input on mount
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Submit on Enter, newline on Shift+Enter
    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading && input.trim()) {
                formRef.current?.requestSubmit();
            }
        }
    }

    const canSubmit = !isLoading && input.trim().length > 0;
    const charCount = input.length;
    const isNearLimit = charCount > 3500;
    const isOverLimit = charCount > 4000;

    return (
        <div
            className={clsx(
                "shrink-0 border-t border-kern-border bg-kern-surface",
                "px-3 py-3 md:px-4 md:py-3"
            )}
        >
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={clsx(
                    "flex items-end gap-2",
                    "rounded-md border transition-colors duration-150",
                    "bg-kern-bg",
                    isOverLimit
                        ? "border-kern-error"
                        : "border-kern-border focus-within:border-kern-green/50"
                )}
            >
                {/* Terminal prompt prefix */}
                <span
                    className="text-kern-green text-sm font-mono pl-3 pb-2.5 shrink-0 hidden sm:block select-none"
                    aria-hidden="true"
                >
                    $
                </span>

                {/* Textarea — grows with content */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    rows={1}
                    placeholder="Ask about Linux, shell, kernel, networking..."
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={4200}
                    aria-label="Message input"
                    aria-describedby="input-hint"
                    className={clsx(
                        "flex-1 bg-transparent font-mono text-sm",
                        "text-kern-text placeholder-kern-muted",
                        "resize-none outline-none border-none",
                        "py-2.5 pr-1",
                        "caret-kern-green",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                        "leading-relaxed"
                    )}
                    style={{ minHeight: "40px", maxHeight: "144px" }}
                />

                {/* Right side: char count + action button */}
                <div className="flex items-end gap-1.5 pr-2 pb-2">
                    {/* Character count — only shown near limit */}
                    {isNearLimit && (
                        <span
                            className={clsx(
                                "text-[10px] font-mono tabular-nums",
                                isOverLimit ? "text-kern-error" : "text-kern-amber"
                            )}
                            aria-live="polite"
                        >
                            {charCount}/4000
                        </span>
                    )}

                    {/* Stop button while streaming */}
                    {isLoading ? (
                        <button
                            type="button"
                            onClick={onStop}
                            className={clsx(
                                "p-1.5 rounded",
                                "text-kern-error border border-kern-error/40",
                                "hover:bg-kern-error/10 transition-colors",
                                "focus:outline-none focus:ring-1 focus:ring-kern-error"
                            )}
                            aria-label="Stop generating"
                        >
                            <Square size={14} />
                        </button>
                    ) : (
                        /* Send button */
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={clsx(
                                "p-1.5 rounded transition-all duration-150",
                                "focus:outline-none focus:ring-1 focus:ring-kern-green",
                                canSubmit
                                    ? "text-kern-green hover:bg-kern-greenMute border border-kern-green/40"
                                    : "text-kern-muted border border-kern-border cursor-not-allowed opacity-40"
                            )}
                            aria-label="Send message"
                        >
                            <Send size={14} />
                        </button>
                    )}
                </div>
            </form>

            {/* Hint text */}
            <p
                id="input-hint"
                className="text-kern-muted text-[10px] font-mono mt-1.5 px-1"
            >
                Enter to send · Shift+Enter for new line
            </p>
        </div>
    );
}
