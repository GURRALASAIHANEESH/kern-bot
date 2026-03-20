import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
    themeColor: "#0a0e0a",
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: "KERN — Linux Terminal Mentor",
        template: "%s · KERN",
    },
    description:
        "A precision AI chatbot for Linux engineers, sysadmins, and terminal dwellers. Scoped to Linux, shell, kernel, networking, and system internals.",
    keywords: [
        "linux", "terminal", "shell", "bash", "kernel",
        "sysadmin", "devops", "chatbot", "AI", "networking",
    ],
    authors: [{ name: "Thinkly Labs" }],
    robots: "index, follow",
    openGraph: {
        title: "KERN — Linux Terminal Mentor",
        description:
            "Not a generic chatbot. A precision Linux mentor scoped to shell, kernel, networking, and system internals.",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "KERN — Linux Terminal Mentor",
        description: "A purpose-built AI chatbot for Linux engineers.",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={jetbrainsMono.variable}
            suppressHydrationWarning
        >
            <body className="bg-kern-bg text-kern-text font-mono antialiased">
                {children}
            </body>
        </html>
    );
}
