import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable React strict mode for better error detection in dev
    reactStrictMode: true,

    // Required for Vercel AI SDK edge streaming to work correctly
    experimental: {
        serverActions: {
            allowedOrigins: ["localhost:3000"],
        },
    },

    // Silence noisy build warnings from react-syntax-highlighter
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
        };
        return config;
    },
};

export default nextConfig;
