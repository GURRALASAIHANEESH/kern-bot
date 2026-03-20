import { clsx } from "clsx";
import { ReactNode, ElementType } from "react";

interface GlowTextProps {
    children: ReactNode;
    className?: string;
    // Whether to run the continuous glow animation
    animate?: boolean;
    // Renders as any HTML element — defaults to span
    as?: ElementType;
    // Color variant
    variant?: "green" | "amber" | "muted";
}

const VARIANT_CLASSES = {
    green: "text-kern-green",
    amber: "text-kern-amber",
    muted: "text-kern-muted",
};

export default function GlowText({
    children,
    className,
    animate = false,
    as: Tag = "span",
    variant = "green",
}: GlowTextProps) {
    return (
        <Tag
            className={clsx(
                VARIANT_CLASSES[variant],
                animate && "animate-glow",
                className
            )}
        >
            {children}
        </Tag>
    );
}
