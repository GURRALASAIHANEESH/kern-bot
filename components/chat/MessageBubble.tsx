"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Components } from "react-markdown";
import { Message } from "ai";
import CodeBlock from "./CodeBlock";
import { clsx } from "clsx";
import { memo } from "react";

interface MessageBubbleProps {
    message: Message;
}

// Markdown component overrides — every element is styled to match the terminal theme
const markdownComponents: Components = {
    // Code blocks and inline code
    code({ node, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        const isInline = !match && !String(children).includes("\n");

        if (isInline) {
            return (
                <code
                    className="px-1.5 py-0.5 rounded text-kern-amber bg-kern-surface
            border border-kern-border font-mono text-[0.8em]"
                    {...props}
                >
                    {children}
                </code>
            );
        }

        const language = match?.[1] ?? "bash";
        const code = String(children).replace(/\n$/, "");

        return <CodeBlock code={code} language={language} />;
    },

    // Paragraphs
    p({ children }) {
        return (
            <p className="text-kern-text text-sm leading-relaxed mb-2 last:mb-0">
                {children}
            </p>
        );
    },

    // Ordered list
    ol({ children }) {
        return (
            <ol className="list-decimal list-inside space-y-1 mb-2 text-sm text-kern-text pl-2">
                {children}
            </ol>
        );
    },

    // Unordered list
    ul({ children }) {
        return (
            <ul className="space-y-1 mb-2 text-sm text-kern-text pl-2">
                {children}
            </ul>
        );
    },

    li({ children }) {
        return (
            <li className="flex gap-2 leading-relaxed">
                <span className="text-kern-green shrink-0 mt-0.5 select-none">›</span>
                <span>{children}</span>
            </li>
        );
    },

    // Headings — KERN uses these for structured multi-section answers
    h1({ children }) {
        return (
            <h1 className="text-kern-green font-bold text-base mb-2 mt-3 first:mt-0">
                {children}
            </h1>
        );
    },
    h2({ children }) {
        return (
            <h2 className="text-kern-green font-semibold text-sm mb-1.5 mt-3 first:mt-0 uppercase tracking-wider">
                {children}
            </h2>
        );
    },
    h3({ children }) {
        return (
            <h3 className="text-kern-greenDim font-semibold text-sm mb-1 mt-2">
                {children}
            </h3>
        );
    },

    // Blockquote — used for "KERN's take:"
    blockquote({ children }) {
        return (
            <blockquote
                className="border-l-2 border-kern-amber pl-3 py-0.5 my-2
          text-kern-amber text-sm italic"
            >
                {children}
            </blockquote>
        );
    },

    // Strong / bold — highlight key terms in green
    strong({ children }) {
        return (
            <strong className="text-kern-green font-semibold not-italic">
                {children}
            </strong>
        );
    },

    // Em / italic
    em({ children }) {
        return <em className="text-kern-amberDim italic">{children}</em>;
    },

    // Horizontal rule — section divider
    hr() {
        return <hr className="border-kern-border my-3" />;
    },

    // Tables (rare but KERN might produce them for comparisons)
    table({ children }) {
        return (
            <div className="overflow-x-auto my-2">
                <table className="w-full text-xs border-collapse border border-kern-border">
                    {children}
                </table>
            </div>
        );
    },
    th({ children }) {
        return (
            <th className="border border-kern-border px-3 py-1.5 text-left text-kern-green bg-kern-surface font-semibold">
                {children}
            </th>
        );
    },
    td({ children }) {
        return (
            <td className="border border-kern-border px-3 py-1.5 text-kern-text">
                {children}
            </td>
        );
    },

    // Links
    a({ href, children }) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-kern-green underline underline-offset-2 hover:text-kern-greenDim transition-colors"
            >
                {children}
            </a>
        );
    },
};

// ─── User Message ────────────────────────────────────────────────────────────

function UserMessage({ content }: { content: string }) {
    return (
        <div className="flex justify-end animate-slide-up">
            <div
                className={clsx(
                    "max-w-[78%] sm:max-w-[65%]",
                    "bg-kern-greenMute border border-kern-border",
                    "rounded-lg px-4 py-2.5",
                    "text-sm text-kern-text leading-relaxed font-mono"
                )}
            >
                {content}
            </div>
        </div>
    );
}

// ─── KERN (Assistant) Message ────────────────────────────────────────────────

function KernMessage({ content }: { content: string }) {
    return (
        <div className="flex gap-3 animate-slide-up">
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

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Name badge */}
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-kern-green text-[11px] font-semibold tracking-wider uppercase">
                        KERN
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-kern-green opacity-60 animate-pulse" />
                </div>

                {/* Markdown-rendered response */}
                <div className="prose-kern">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={markdownComponents}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

// ─── Export (memoized — prevents re-render of settled messages) ──────────────

const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
    if (message.role === "user") {
        return <UserMessage content={message.content} />;
    }
    return <KernMessage content={message.content} />;
});

export default MessageBubble;
