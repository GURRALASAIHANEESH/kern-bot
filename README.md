# KERN — Linux Terminal Mentor

> A purpose-built AI chatbot for Linux engineers, sysadmins, and terminal dwellers.
> Not a generic chatbot — a focused product with a hard scope and intentional design.

## What it does

KERN is an AI mentor scoped exclusively to Linux:
shell scripting, kernel internals, cgroups, networking,
systemd, filesystem management, observability, and security hardening.

Ask outside that scope — KERN tells you clearly. No off-topic drift.

## Why this topic

Linux has deep, specific, learnable content that maps perfectly to a
knowledge-base-driven chatbot. The terminal aesthetic gives the UI an
immediate, unmistakable identity. The hard scope makes the bot feel
genuinely trained, not like a GPT wrapper.

## Stack

| Layer        | Choice                              |
|--------------|-------------------------------------|
| Framework    | Next.js 15 (App Router)             |
| AI           | Vercel AI SDK · OpenAI gpt-4o-mini  |
| Streaming    | Edge runtime · `streamText`         |
| Styling      | Tailwind CSS · terminal design tokens |
| Markdown     | react-markdown · remark-gfm         |
| Syntax       | react-syntax-highlighter (vscDarkPlus) |
| Deployment   | Vercel                              |

## Architecture decisions

- **Static RAG without a vector DB** — knowledge base chunks are
  scored against the user's query at runtime using keyword matching,
  and the top 3 chunks are injected into the system prompt.
  Fully explainable, zero external dependencies.

- **Hard-scoped system prompt** — KERN has an explicit allowed-topics
  list and a defined out-of-scope response format. The bot cannot drift.

- **Streaming with `experimental_throttle: 50`** — chunks are batched
  every 50ms to prevent DOM thrashing on fast responses.

- **Message memoization** — `MessageBubble` is wrapped in `React.memo`
  so settled messages never re-render during streaming.

- **Scroll position awareness** — auto-scroll only triggers when the
  user is within 80px of the bottom. Reading previous messages is
  never interrupted.

## Running locally

```bash
git clone https://github.com/yourusername/kern-bot
cd kern-bot
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
vercel --prod
```

Add `OPENAI_API_KEY` in:
**Vercel Dashboard → Project → Settings → Environment Variables**

## Loom walkthrough outline

1. Open deployed app — show landing boot sequence and CTA
2. Walk `lib/system-prompt.ts` — explain retrieval and scope enforcement
3. Show `app/api/chat/route.ts` — Zod validation, token trimming, streaming
4. Walk `lib/knowledge-base.ts` — explain the content structure
5. Show `ChatContainer` → `MessageList` → `MessageBubble` component tree
6. Demonstrate empty state, typing indicator, error state, stop button
7. Show mobile layout — sidebar drawer, responsive input
8. Open Vercel dashboard — env vars and deployment
