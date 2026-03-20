"use client";

import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Terminal } from "lucide-react";
import { clsx } from "clsx";

interface CodeBlockProps {
    code: string;
    language: string;
    showLineNumbers?: boolean;
}

// Normalize language aliases that react-syntax-highlighter doesn't know
const LANG_ALIASES: Record<string, string> = {
    sh: "bash",
    shell: "bash",
    zsh: "bash",
    console: "bash",
    term: "bash",
    ini: "ini",
    conf: "nginx",
    systemd: "ini",
};

function normalizeLanguage(lang: string): string {
    const lower = lang.toLowerCase().trim();
    return LANG_ALIASES[lower] ?? lower;
}

// Language display label shown in the header bar
const LANG_LABELS: Record<string, string> = {
    bash: "bash",
    python: "python",
    c: "c",
    ini: "systemd/ini",
    nginx: "nginx/conf",
    text: "output",
    diff: "diff",
};

export default function CodeBlock({
    code,
    language,
    showLineNumbers = false,
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const normalized = normalizeLanguage(language);
    const label = LANG_LABELS[normalized] ?? normalized;

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for environments without clipboard API
            const el = document.createElement("textarea");
            el.value = code;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [code]);

    return (
        <div className="rounded-md border border-kern-border overflow-hidden my-2 group">
            {/* Header bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b16] border-b border-kern-border">
                <div className="flex items-center gap-2">
                    <Terminal size={11} className="text-kern-muted" />
                    <span className="text-kern-muted text-[11px] font-mono tracking-wide">
                        {label}
                    </span>
                </div>

                <button
                    onClick={handleCopy}
                    aria-label={copied ? "Copied" : "Copy code"}
                    className={clsx(
                        "flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded",
                        "transition-all duration-150",
                        copied
                            ? "text-kern-green bg-kern-greenMute"
                            : "text-kern-muted hover:text-kern-green hover:bg-kern-greenMute"
                    )}
                >
                    {copied ? (
                        <>
                            <Check size={11} />
                            <span>copied</span>
                        </>
                    ) : (
                        <>
                            <Copy size={11} />
                            <span>copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code body */}
            <SyntaxHighlighter
                language={normalized}
                style={vscDarkPlus}
                showLineNumbers={showLineNumbers || code.split("\n").length > 8}
                wrapLongLines={false}
                customStyle={{
                    margin: 0,
                    padding: "1rem",
                    background: "#0d1117",
                    fontSize: "0.78rem",
                    lineHeight: "1.65",
                    borderRadius: 0,
                }}
                lineNumberStyle={{
                    color: "#2a3a2a",
                    minWidth: "2.5em",
                    paddingRight: "1em",
                    userSelect: "none",
                }}
                codeTagProps={{
                    style: {
                        fontFamily:
                            "var(--font-jetbrains), 'JetBrains Mono', 'Fira Code', monospace",
                    },
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
