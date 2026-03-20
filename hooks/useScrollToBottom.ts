import { useEffect, useRef, RefObject } from "react";
import { Message } from "ai";

// Returns a ref to attach to the scroll anchor element
// Only auto-scrolls when user is already near the bottom
// Prevents hijacking scroll when user reads previous messages

export default function useScrollToBottom(
    messages: Message[],
    threshold = 80
): RefObject<HTMLDivElement | null> {
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isNearBottom = useRef(true);

    // Find the scrollable parent once anchor is mounted
    useEffect(() => {
        if (!anchorRef.current) return;
        let el = anchorRef.current.parentElement;
        while (el) {
            const { overflowY } = window.getComputedStyle(el);
            if (overflowY === "auto" || overflowY === "scroll") {
                containerRef.current = el as HTMLDivElement;
                break;
            }
            el = el.parentElement;
        }
    }, []);

    // Track scroll position
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        function onScroll() {
            if (!container) return;
            const distFromBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight;
            isNearBottom.current = distFromBottom < threshold;
        }

        container.addEventListener("scroll", onScroll, { passive: true });
        return () => container.removeEventListener("scroll", onScroll);
    }, [threshold]);

    // Scroll to bottom on new messages — only if near bottom
    useEffect(() => {
        if (!isNearBottom.current) return;
        anchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Hard scroll when conversation resets to first message
    useEffect(() => {
        if (messages.length === 1) {
            anchorRef.current?.scrollIntoView({ behavior: "instant" });
            isNearBottom.current = true;
        }
    }, [messages.length]);

    return anchorRef;
}
