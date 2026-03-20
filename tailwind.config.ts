import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                kern: {
                    bg: "#0a0e0a",
                    surface: "#0f150f",
                    border: "#1a2e1a",
                    green: "#00ff41",
                    greenDim: "#00cc33",
                    greenMute: "#004d14",
                    amber: "#ffb300",
                    amberDim: "#cc8800",
                    text: "#c8ffc8",
                    muted: "#4a6b4a",
                    error: "#ff4444",
                },
            },
            fontFamily: {
                mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
            },
            boxShadow: {
                "kern-glow": "0 0 20px rgba(0,255,65,0.15), 0 0 40px rgba(0,255,65,0.05)",
                "kern-border": "inset 0 0 0 1px rgba(0,255,65,0.2)",
                "kern-panel": "0 4px 24px rgba(0,0,0,0.6)",
            },
        },
    },
    plugins: [],
};

export default config;
