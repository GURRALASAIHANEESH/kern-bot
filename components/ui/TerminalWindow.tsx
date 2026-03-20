import { clsx } from "clsx";
import { ReactNode } from "react";

interface TerminalWindowProps {
    title?: string;
    children: ReactNode;
    className?: string;
    // Controls whether the title bar traffic lights are shown
    showControls?: boolean;
    // Optional subtitle shown after the title with muted styling
    subtitle?: string;
}

export default function TerminalWindow({
    title = "kern@linux:~",
    subtitle,
    children,
    className,
    showControls = true,
}: TerminalWindowProps) {
    return (
        <div
            className={clsx(
                "rounded-lg overflow-hidden",
                "border border-kern-border",
                "bg-kern-surface",
                "shadow-kern-panel",
                className
            )}
        >
            {/* Title bar */}
            <div
                className={clsx(
                    "flex items-center gap-2 px-4 py-2.5",
                    "border-b border-kern-border",
                    "bg-kern-bg"
                )}
                aria-hidden="true"
            >
                {/* Traffic light buttons */}
                {showControls && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80" />
                        <span className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />
                        <span className="w-3 h-3 rounded-full bg-[#27c93f] opacity-80" />
                    </div>
                )}

                {/* Title + optional subtitle */}
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-kern-muted text-xs font-mono truncate">
                        {title}
                    </span>
                    {subtitle && (
                        <>
                            <span className="text-kern-muted opacity-30 text-xs">—</span>
                            <span className="text-kern-muted text-xs font-mono opacity-50 truncate">
                                {subtitle}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">{children}</div>
        </div>
    );
}
