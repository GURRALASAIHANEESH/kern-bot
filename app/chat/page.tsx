import type { Metadata } from "next";
import { Suspense } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
    title: "Chat · KERN",
};

// Loading skeleton shown during ChatContainer hydration
function ChatSkeleton() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
            <div className="w-8 h-8 rounded border border-kern-border animate-pulse" />
            <div className="space-y-2 w-48">
                <div className="h-2 bg-kern-border rounded animate-pulse" />
                <div className="h-2 bg-kern-border rounded animate-pulse w-3/4 mx-auto" />
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <div className="h-screen-safe flex flex-col bg-kern-bg overflow-hidden">
            <Header />
            <div className="flex-1 overflow-hidden">
                <Suspense fallback={<ChatSkeleton />}>
                    <ChatContainer />
                </Suspense>
            </div>
        </div>
    );
}
