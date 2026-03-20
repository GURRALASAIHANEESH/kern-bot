import Link from "next/link";

export default function Header() {
    return (
        <header className="h-12 border-b border-kern-border bg-kern-surface flex items-center justify-between px-4 md:px-6 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
                <span className="text-kern-green font-bold text-lg tracking-tight group-hover:animate-glow transition-all">
                    KERN
                </span>
                <span className="text-kern-muted text-xs hidden sm:block font-mono">
                    / linux-mentor
                </span>
            </Link>

            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-kern-green animate-pulse" />
                <span className="text-kern-muted text-xs font-mono">
                    online · llama-3.3-70b
                </span>
            </div>
        </header>
    );
}
