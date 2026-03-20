import os

files = [
    "app/layout.tsx",
    "app/page.tsx",
    "app/chat/page.tsx",
    "app/api/chat/route.ts",
    "components/landing/BootSequence.tsx",
    "components/landing/HeroTerminal.tsx",
    "components/landing/CTAButton.tsx",
    "components/chat/ChatContainer.tsx",
    "components/chat/MessageList.tsx",
    "components/chat/MessageBubble.tsx",
    "components/chat/CodeBlock.tsx",
    "components/chat/TypingIndicator.tsx",
    "components/chat/SuggestedPrompts.tsx",
    "components/chat/TopicSidebar.tsx",
    "components/chat/InputBar.tsx",
    "components/ui/TerminalWindow.tsx",
    "components/ui/GlowText.tsx",
    "components/layout/Header.tsx",
    "lib/system-prompt.ts",
    "lib/knowledge-base.ts",
    "lib/suggested-prompts.ts",
    "hooks/useScrollToBottom.ts",
    "styles/globals.css",
    "public/kern-avatar.svg",
    "public/favicon.ico",
    ".env.local",
    ".env.example",
    "next.config.ts",
    "tailwind.config.ts",
    "tsconfig.json",
    "vercel.json",
    "README.md"
]

base_dir = r"d:\kern-bot"

for f in files:
    full_path = os.path.join(base_dir, f)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    # create empty file
    with open(full_path, 'w') as f_out:
        pass

print("Folder structure and files created successfully.")
