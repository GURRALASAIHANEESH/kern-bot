# KERN — Linux Terminal Mentor

> A precision AI chatbot built for Linux engineers, sysadmins, and anyone who lives in the terminal.
> Hard-scoped to Linux. Intentionally designed. Not a wrapper.

![KERN Terminal UI](public/kern-avatar.svg)

---

## Overview

Most AI chatbots try to answer everything. KERN does the opposite.

I built KERN as a focused product — a Linux specialist that knows its domain deeply and refuses to drift outside it. Ask about shell scripting, kernel internals, systemd, networking, or observability and you get grounded, specific, production-aware answers. Ask about anything else and KERN tells you clearly.

The hard scope isn't a limitation — it's the feature. It makes the bot feel genuinely trained on a domain rather than a generic assistant with a system prompt.

---

## Live Demo

**[kern-bot.vercel.app](https://kern-bot.vercel.app)**

---

## What KERN Covers

| Domain | Topics |
|---|---|
| **Shell** | Bash internals, scripting patterns, POSIX compliance, parameter expansion |
| **Kernel** | Process management, signals, /proc, fork/exec, OOM killer, kworkers |
| **Networking** | iptables, nftables, ip routing, ss, tcpdump, DNS, TCP/IP stack |
| **Filesystem** | ext4, xfs, btrfs, inodes, mounts, LVM, fstab, disk I/O |
| **SystemD** | Unit files, service debugging, journalctl, dependency ordering |
| **Observability** | strace, perf, bpftrace, dmesg, lsof, iostat, vmstat |
| **Security** | SELinux, AppArmor, capabilities, seccomp, auditd, hardening |

Ask outside this scope — KERN responds with exactly one line and no apology.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Edge-ready, streaming-native, file-based routing |
| AI SDK | Vercel AI SDK v4 | `useChat` hook handles streaming, state, and cancellation |
| Inference | Groq — Llama 3.3 70B | Free tier, sub-second first token, strong instruction following |
| Styling | Tailwind CSS + custom tokens | Terminal design system built on CSS variables |
| Markdown | react-markdown + remark-gfm | Full GFM support — tables, code fences, strikethrough |
| Syntax | react-syntax-highlighter | VSCode Dark Plus theme, language-aware highlighting |
| Deployment | Vercel edge runtime | Streaming responses, global CDN, instant deploys |

---

## Architecture

### Retrieval — Static RAG Without a Vector DB

KERN uses a hand-curated knowledge base of domain chunks. On every request, a keyword scoring function runs against the user's query and injects the top 3 most relevant chunks into the system prompt.

```
User query
    ↓
scoreChunk() — keyword + title + content match scoring
    ↓
Top 3 chunks selected
    ↓
Injected into system prompt as grounded context
    ↓
LLM generates answer using that context directly
```

Each knowledge chunk contains:
- Full technical content (not summaries)
- Verified command examples
- Common mistakes engineers make in that area

This gives the model specific, correct material to draw from — instead of generating from general training data.

### Scope Enforcement

The system prompt contains a hard allowed-topics list and an explicit out-of-scope response format. The model cannot drift — it either answers from its Linux knowledge or returns a single rejection line. No hedging, no partial answers on unrelated topics.

### Streaming Architecture

```
POST /api/chat (Edge runtime)
    ↓
Zod validation → message history trim → context retrieval
    ↓
streamText() → Groq API
    ↓
toDataStreamResponse() → chunked HTTP response
    ↓
useChat() hook → incremental UI update
```

Responses stream token-by-token. A stop button lets users cancel mid-stream. `MessageBubble` is memoized so settled messages never re-render during active streaming.

### Scroll Awareness

Auto-scroll only triggers when the user is within 80px of the bottom. Reading previous messages is never interrupted by new content arriving.

---

## Project Structure

```
kern-bot/
├── app/
│   ├── api/chat/route.ts      # Edge API — Zod validation, retrieval, streaming
│   ├── chat/page.tsx          # Chat interface page
│   ├── layout.tsx             # Root layout — fonts, metadata, viewport
│   └── page.tsx               # Landing page — boot sequence, hero terminal
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx  # Root chat component — state, layout, sidebar
│   │   ├── MessageList.tsx    # Virtualized message list with empty/loading states
│   │   ├── MessageBubble.tsx  # Individual message — markdown, code, memoized
│   │   ├── CodeBlock.tsx      # Syntax-highlighted code with copy button
│   │   ├── InputBar.tsx       # Auto-resizing textarea, send/stop, char limit
│   │   ├── TypingIndicator.tsx # Animated thinking states during streaming
│   │   ├── SuggestedPrompts.tsx # Category-filtered prompt pills
│   │   └── TopicSidebar.tsx   # Collapsible knowledge base navigation
│   ├── landing/
│   │   ├── BootSequence.tsx   # Timed OK/WARN/INFO boot lines
│   │   ├── HeroTerminal.tsx   # Typewriter intro in terminal window
│   │   └── CTAButton.tsx      # Animated session initialization button
│   ├── layout/
│   │   └── Header.tsx         # Nav bar with live status indicator
│   └── ui/
│       ├── TerminalWindow.tsx # Reusable terminal chrome component
│       └── GlowText.tsx       # Polymorphic green glow text component
├── hooks/
│   └── useScrollToBottom.ts   # Scroll-aware auto-scroll hook
├── lib/
│   ├── knowledge-base.ts      # Curated Linux domain chunks with examples
│   ├── suggested-prompts.ts   # Category-mapped starter prompts
│   └── system-prompt.ts       # Retrieval engine + prompt builder
└── styles/
    └── globals.css            # Design tokens, animations, prose overrides
```

---

## Design System

Built a full terminal design system using Tailwind CSS custom tokens:

```ts
kern: {
  bg:        "#0a0e0a",   // near-black green-tinted background
  surface:   "#0f150f",   // elevated surfaces
  border:    "#1a2e1a",   // subtle green borders
  green:     "#00ff41",   // phosphor green — primary brand color
  greenMute: "#004d14",   // muted green for backgrounds
  amber:     "#ffb300",   // warnings, KERN's take callouts
  text:      "#c8ffc8",   // body text — softer than pure green
  muted:     "#4a6b4a",   // secondary text, placeholders
  error:     "#ff4444",   // errors, stop button
}
```

Animations: boot sequence fade-in, typewriter effect, blinking cursor, phosphor glow pulse — all CSS keyframes, no animation library.

---

## Running Locally

```bash
git clone https://github.com/gurrala-sai-haneesh/kern-bot
cd kern-bot
npm install
cp .env.example .env.local
```

Add your API key to `.env.local`:

```bash
# Free — get at console.groq.com (no credit card)
GROQ_API_KEY=gsk_your_key_here
```

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploying

```bash
npm i -g vercel
vercel --prod
```

Add `GROQ_API_KEY` in:
**Vercel Dashboard → Project → Settings → Environment Variables**

Redeploy once after adding the key.

---

## Design Decisions Worth Noting

**Why keyword retrieval and not vector embeddings?**
For a curated 10-domain knowledge base, keyword scoring is fully deterministic, explainable, and has zero infrastructure cost. The scoring function weights exact keyword matches (×3), title matches (×2), and content word overlap (×1) — giving reliable retrieval for the question classes KERN handles. A vector DB would improve recall on semantically ambiguous queries but adds operational complexity that isn't justified at this scope.

**Why Groq instead of OpenAI?**
Groq's free tier runs Llama 3.3 70B with sub-second first token latency — faster than OpenAI's paid tier in practice. For a streaming chat interface, time-to-first-token matters more than raw throughput. Llama 3.3 70B follows KERN's system prompt precisely, including the hard scope rules and the few-shot response format.

**Why a static knowledge base instead of live search?**
Linux documentation doesn't change frequently. A static curated KB means every answer is grounded in content I've reviewed and structured — not random web results. The tradeoff is coverage: the KB handles the most common Linux engineering questions well. Obscure edge cases fall back to the model's base training knowledge, which is substantial for Linux.

**Why hard scope enforcement?**
A chatbot that answers everything is a worse product than one that does one thing well. The hard scope makes KERN feel intentional — like a tool built for a specific person with a specific job — rather than a general assistant that happens to know some Linux.

---

## Known Limitations

- **Retrieval is keyword-based** — semantic similarity queries (e.g. "my server feels sluggish") may not retrieve the most relevant chunk. Embedding-based retrieval would improve this.
- **Knowledge base is static and hand-curated** — 10 domains, ~160 patterns. Uncommon topics fall back to model base knowledge.
- **No session persistence** — conversation history lives in memory per browser tab. Closing the tab resets the session.
- **20-message history cap** — older messages are dropped, not summarized. Long debug sessions may lose early context.

---

## What I'd Build Next

1. **Vector embeddings** — replace keyword scoring with pgvector on Neon for semantic retrieval
2. **Man page ingestion** — pipe all Linux man pages through an embedding pipeline for near-complete coverage
3. **Session persistence** — store conversations in PostgreSQL, resume across tabs and devices
4. **Source citations** — surface which knowledge chunk or doc section grounded each answer
5. **Conversation summarization** — compress old context instead of dropping it at the 20-message cap

---

*Built by Gurrala Sai Haneesh*
