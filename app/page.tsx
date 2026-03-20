import type { Metadata } from "next";
import HeroTerminal from "@/components/landing/HeroTerminal";
import BootSequence from "@/components/landing/BootSequence";
import CTAButton from "@/components/landing/CTAButton";

export const metadata: Metadata = {
    title: "KERN — Linux Terminal Mentor",
};

export default function LandingPage() {
    return (
        <main
            className="min-h-screen bg-kern-bg flex flex-col items-center
        justify-center px-4 py-16 relative overflow-hidden"
        >
            {/* Ambient radial glow — purely decorative */}
            <div
                className="absolute inset-0 pointer-events-none select-none"
                aria-hidden="true"
            >
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[700px] h-[700px] rounded-full
            bg-kern-green opacity-[0.025] blur-[80px]"
                />
            </div>

            <div className="relative z-10 w-full max-w-2xl flex flex-col gap-8">

                {/* ── Brand header ── */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-kern-muted text-[10px] font-mono tracking-[0.4em] uppercase">
                        Linux Intelligence · Built for the Terminal
                    </span>

                    <h1
                        className="text-kern-green font-bold tracking-tight animate-glow"
                        style={{ fontSize: "clamp(3rem, 10vw, 5.5rem)", lineHeight: 1 }}
                    >
                        KERN
                    </h1>

                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-kern-green animate-pulse" />
                        <p className="text-kern-muted text-xs font-mono tracking-widest uppercase">
                            The Linux engineer on your team
                        </p>
                    </div>
                </div>

                {/* ── Hero terminal window ── */}
                <HeroTerminal />

                {/* ── Boot sequence ── */}
                <BootSequence />

                {/* ── CTA ── */}
                <div className="flex flex-col items-center gap-4">
                    <CTAButton />

                    {/* Scope tags */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {[
                            "Shell", "Kernel", "Networking",
                            "Filesystem", "SystemD", "Observability", "Security",
                        ].map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 text-[10px] font-mono
                  border border-kern-border text-kern-muted rounded-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom attribution */}
            <footer className="absolute bottom-4 text-kern-muted text-[10px] font-mono opacity-30">
                deep linux knowledge · on demand
            </footer>
        </main>
    );
}
