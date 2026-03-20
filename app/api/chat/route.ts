import { createGroq } from "@ai-sdk/groq";
import { streamText, Message } from "ai";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const runtime = "edge";
export const maxDuration = 30;

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

// Relaxed schema — id is optional, content can come from parts
const MessageSchema = z.object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant", "system", "tool"]),
    content: z.union([
        z.string(),
        z.array(z.any()),   // AI SDK v4 sends content as parts array
    ]),
});

const RequestSchema = z.object({
    messages: z.array(MessageSchema).min(1).max(50),
});

const MAX_HISTORY_MESSAGES = 20;

function trimMessageHistory(messages: Message[]): Message[] {
    if (messages.length <= MAX_HISTORY_MESSAGES) return messages;
    return [messages[0], ...messages.slice(-(MAX_HISTORY_MESSAGES - 1))];
}

// Safely extract string content from either string or parts array
function extractContent(content: string | unknown[]): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .map((part: any) => (part?.text ?? part?.content ?? ""))
            .join("");
    }
    return "";
}

export async function POST(req: Request) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid JSON in request body" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
        // Log exact validation error in dev
        console.error("[KERN 422]", JSON.stringify(parsed.error.flatten(), null, 2));
        return new Response(
            JSON.stringify({
                error: "Invalid request shape",
                details: parsed.error.flatten(),
            }),
            { status: 422, headers: { "Content-Type": "application/json" } }
        );
    }

    // Normalize messages to string content
    const normalizedMessages: Message[] = parsed.data.messages.map((m) => ({
        id: m.id ?? crypto.randomUUID(),
        role: m.role as Message["role"],
        content: extractContent(m.content as string | unknown[]),
    }));

    const trimmed = trimMessageHistory(normalizedMessages);

    const latestUserMessage =
        [...trimmed].reverse().find((m) => m.role === "user")?.content ?? "";

    const systemPrompt = buildSystemPrompt(latestUserMessage);

    try {
        const result = await streamText({
            model: groq("llama-3.3-70b-versatile"),
            system: systemPrompt,
            messages: trimmed,
            temperature: 0.15,   // was 0.2 — lower = more factually reliable on technical content
            maxTokens: 1500,
            frequencyPenalty: 0.3,   // penalises repeating the same phrases
            presencePenalty: 0.1,    // nudges model to cover more ground per response
        });

        return result.toDataStreamResponse();
    } catch (err) {
        console.error("[KERN API Error]", err);
        return new Response(
            JSON.stringify({ error: "KERN is unavailable. Check API key." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
